import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as FargateTest from '../lib/fargate-test-stack';
import * as ec2 from "@aws-cdk/aws-ec2";

test('Empty Stack', () => {
    const app = new cdk.App();
    const vpc = new ec2.Vpc(app, 'TheVPC', {
      cidr: "10.0.0.0/16"
    });
    // WHEN
    const stack = new FargateTest.FargateTestStack(app, 'MyTestStack', vpc);
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
