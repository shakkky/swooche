import { Schema, Types } from "mongoose";
import {
  z,
  ZodTypeAny,
  ZodObject,
  ZodOptional,
  ZodDefault,
  ZodEffects,
} from "zod";

/**
 * Helper to fully unwrap optional/default/wrapped Zod types
 */
function unwrapZodType(zodType: ZodTypeAny): {
  type: ZodTypeAny;
  defaultValue?: any;
  optional: boolean;
} {
  let currentType = zodType;
  let defaultValue: any = undefined;
  let optional = false;

  while (true) {
    if (currentType instanceof ZodOptional) {
      optional = true;
      currentType = currentType._def.innerType;
    } else if (currentType instanceof ZodDefault) {
      optional = true;
      defaultValue = currentType._def.defaultValue();
      currentType = currentType._def.innerType;
    } else if (currentType instanceof ZodEffects) {
      currentType = currentType._def.schema;
    } else {
      break;
    }
  }

  return { type: currentType, defaultValue, optional };
}

/**
 * Converts a Zod schema into a Mongoose Schema.
 */
export function zodToMongoose<T extends ZodTypeAny>(zodSchema: T): Schema {
  if (!(zodSchema instanceof ZodObject)) {
    throw new Error(
      "zodToMongoose only supports ZodObject schemas at the top level"
    );
  }

  const mongooseSchemaDefinition: Record<string, any> = {};

  for (const [key, rawField] of Object.entries(zodSchema.shape)) {
    const {
      type: zodField,
      defaultValue,
      optional,
    } = unwrapZodType(rawField as ZodTypeAny);

    let fieldDef: any = {};

    if (zodField instanceof z.ZodString) {
      const description = zodField.description;
      if (description === "ObjectId") {
        fieldDef.type = Types.ObjectId;
      } else {
        fieldDef.type = String;
      }
    } else if (zodField instanceof z.ZodNumber) {
      fieldDef.type = Number;
    } else if (zodField instanceof z.ZodBoolean) {
      fieldDef.type = Boolean;
    } else if (zodField instanceof z.ZodDate) {
      fieldDef.type = Date;
    } else if (zodField instanceof z.ZodEnum) {
      fieldDef.type = String;
      fieldDef.enum = zodField.options;
    } else if (zodField instanceof z.ZodObject) {
      fieldDef = new Schema(zodToMongoose(zodField));
    } else {
      throw new Error(
        `Unsupported Zod type for field '${key}': ${zodField.constructor.name}`
      );
    }

    if (defaultValue !== undefined) {
      fieldDef.default = defaultValue;
    }

    if (fieldDef.type) {
      fieldDef.required = defaultValue === undefined && !optional;
    }

    mongooseSchemaDefinition[key] = fieldDef;
  }

  return new Schema(mongooseSchemaDefinition, { timestamps: true });
}
