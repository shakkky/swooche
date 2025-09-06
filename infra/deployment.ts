import { ECRClient, DescribeImagesCommand } from "@aws-sdk/client-ecr";

const ecrClient = new ECRClient({ region: "ap-southeast-2" });

const awsAccountId = process.env.AWS_ACCOUNT_ID;

if (!awsAccountId) {
  throw new Error("AWS_ACCOUNT_ID environment variable is not set");
}

export const getEcrServiceImageUrl = async (appName: "website" | "api") => {
  const imagesResult = await ecrClient.send(
    new DescribeImagesCommand({
      repositoryName: "services",
      imageIds: [{ imageTag: appName }],
    })
  );

  const digest = imagesResult.imageDetails?.[0]?.imageDigest;
  if (!digest) {
    throw new Error(`No image found with tag '${appName}'`);
  }

  return `${awsAccountId}.dkr.ecr.ap-southeast-2.amazonaws.com/services@${digest}`;
};

export const getDomainName = (
  stage: string,
  appName: "website" | "api" | "app"
) => {
  if (!stage) {
    throw new Error("Stage is not defined");
  }

  if (stage === "production") {
    return appName === "website" ? "swooche.com" : `${appName}.swooche.com`;
  }

  return `${stage}-${appName}.swooche.com`;
};
