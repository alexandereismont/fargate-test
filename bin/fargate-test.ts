#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FargateTestStack } from '../lib/fargate-test-stack';
import { VpcCommon } from '../lib/vpc-common';

const app = new cdk.App();
const vpcCommon = new VpcCommon(app, "VpcCommon");

new FargateTestStack(app, 'FargateTestApplication', vpcCommon.vpc);
