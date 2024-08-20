# QUIP TEMPLATE COPY WITH SLACK NOTIFCATION
# Summary

# Details
## Prerequisites 
See Quip for screenshots of how to set these up.
1. You will need a QUIP token
2. You will need to create a slack webhook (workflow) and get the URL. You will need one for every channel you wish to send messages to. It must accept the following paramaters to work: DocumentLink,DocumentName,text


## Run unit tests on Lambda

```bash
cd quip-generate-slack-notify/
npm run test
```

## Build and Deploy
```bash
cd ..
sam build
sam deploy # add --guided for first time SAM deployment in a region.
```
## Event structure
Event interface
```bash
{
    webhook: string;
    quipToken: string;
    quipTemplateId: string;
    quipDocumentNamePrepend: string;
    quipFolderId: string;
    frequency: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    text: string;
}
```
Example Monthly review - we want the date to be for the current Month e.g. Monthly Program Review -  2024-08
```json
{
    "dayOfMonth": 0,
    "dayOfWeek": 2,
    "frequency": "Monthly",
    "quipDocumentNamePrepend": "Monthly Program Review - ",
    "quipFolderId": "UgtCOdh2PEXn",
    "quipTemplateId": "KWOiA5bIezAE",
    "quipToken": "XXX",
    "text": "A new Monthly Program Review document has been created in the ssimmo-test-doc-gen folder, notifying ssimmoo-test channel",
    "webhook": "XXX"
}
```
Example weekly ops review - we want the date to be Next Tuesday (assumption we run it the week before on Thursday/Friday) e.g. :  Operational Excellence Review 2024-08-19
```json
{
    "dayOfMonth": 0,
    "dayOfWeek": 2,
    "frequency": "Weekly",
    "quipDocumentNamePrepend": "Operational Excellence Review ",
    "quipFolderId": "UgtCOdh2PEXn",
    "quipTemplateId": "r5pyANChzggQ",
    "quipToken": "xxx",
    "text": "A new Operational Excellence Review document has been created in the ssimmo-test-doc-gen folder, notifying ssimmoo-test channel",
    "webhook": "xxx"
}
```
## Manual TESTING of deployed lambda
```bash
sam remote invoke --stack-name new-quip-generator-with-slack-notification QuipGenerateSlackNotify --event-file events/monthlyopsEvent.json --region us-east-1
```
## Adding events to scheduler
The scheduler sends events based on the schedule, the events contain the secrets and info needed to create the quip document and send a notification to slack.

I use a VS code plugin to easily stringify the JSON object into the template. 

Add new events... simply use cli. After deploying get arn from QuipGenerateSlackNotify variable and role arn QuipGenerateSlackNotifyIamRole

You can also add them in the SAM template, see examples in template, these can be encrypted in scheduler but they are not encrypted in the template file, which is a concern e.g. when committing to a repo due to the secrets for quip and slack. Hence CLI maybe a better solution (or console).

Note values used below are not real accounts/arns etc.
```bash
aws scheduler create-schedule \
    --name my-schedule \
    --schedule-expression "cron(35 17 ? * FRI *)" \
    --target '{"Arn": "arn:aws:sqs:us-west-2:123456789012:QuipGenerateSlackNotify", "RoleArn": "arn:aws:iam::123456789012:role/QuipGenerateSlackNotifyRole"}' \
    --input '{\"webhook\":\"xxx",\"quipToken\":\"xxx",\"quipTemplateId\":\"r5pyANChzggQ\",\"quipFolderId\":\"UgtCOdh2PEXn\",\"quipDocumentNamePrepend\":\"myquipDocumentNamePrepend\",\"frequency\":\"Weekly\",\"dayOfWeek\":2,\"dayOfMonth\":1,\"text\":\"My example doc OPS template copied to ssimmo-test-doc-gen folder, notifing ssimmoo-test channel\"}' \
    --schedule-expression-timezone "America/Vancouver" \
    --flexible-time-window '{"Mode": "OFF"} \
    --kms-key-arn arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab'
```


# Apendix boilerplate SAM readme.
This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- quip-generate-slack-notify - Code for the application's Lambda function written in TypeScript.
- events - Invocation events that you can use to invoke the function.
- quip-generate-slack-notify/tests - Unit tests for the application code. 
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit.  
The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through debugging experience for Lambda function code. See the following links to get started.

* [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 20](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
new-quip-generator-with-slack-notification$ sam build
```

The SAM CLI installs dependencies defined in `quip-generate-slack-notify/package.json`, compiles TypeScript with esbuild, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
new-quip-generator-with-slack-notification$ sam local invoke HelloWorldFunction --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
new-quip-generator-with-slack-notification$ sam local start-api
new-quip-generator-with-slack-notification$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
new-quip-generator-with-slack-notification$ sam logs -n HelloWorldFunction --stack-name new-quip-generator-with-slack-notification --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `quip-generate-slack-notify/tests` folder in this project. Use NPM to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
new-quip-generator-with-slack-notification$ cd quip-generate-slack-notify
quip-generate-slack-notify$ npm install
quip-generate-slack-notify$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name new-quip-generator-with-slack-notification
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
