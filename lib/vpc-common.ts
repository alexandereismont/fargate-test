import * as cdk from '@aws-cdk/core';
import { Vpc, SubnetType } from "@aws-cdk/aws-ec2";

export class VpcCommon extends cdk.Stack {
  readonly vpc: Vpc;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*const vpc = new Vpc(this, 'TheVPC', {
      cidr: "10.0.0.0/16"
   });*/
    const vpc = this.vpc = new Vpc(this, 'MY-VPN', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 26,
          name: 'privatesubnet',
          subnetType: SubnetType.PRIVATE,
        },
        {
          cidrMask: 26,
          name: 'publicsubnet',
          subnetType: SubnetType.PUBLIC
        }
      ],
      natGateways: 1
    });
  }
}

