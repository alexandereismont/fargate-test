import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { Vpc } from '@aws-cdk/aws-ec2';
import { TaskDefinition } from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as ecr from '@aws-cdk/aws-ecr'

export class FargateTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, vpc: Vpc, props?: cdk.StackProps) {
    super(scope, id, props);

    //Cluster
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });

    //Roles
    const ecsExecutionRole = new iam.Role(this, id + "-ExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com") 
    });

    const ecsTaskRole = new iam.Role(this, id + "-TaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
    });
    
    //ECR
    const repository = new ecr.Repository(this, id + '-repository');

    //Task definition
    const task = new TaskDefinition(this, id + "-TaskDefinition", {
      compatibility: ecs.Compatibility.FARGATE,
      cpu:"2048",
      memoryMiB:"8192",
      executionRole:ecsExecutionRole,
      taskRole:ecsTaskRole,
    });

    task.addContainer(id + '-container', {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    //  image: ecs.ContainerImage.fromEcrRepository(repository),
      memoryLimitMiB: 1024,
      portMappings: [{ containerPort: 8080 }]
    });
    
    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, id, {
      cluster: cluster, // Required
      cpu: 512, // Default is 256
      desiredCount: 2, // Default is 1
      taskDefinition: task,
    //  taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 2048, // Default is 512
      publicLoadBalancer: false // Default is false
    });
  }
}
