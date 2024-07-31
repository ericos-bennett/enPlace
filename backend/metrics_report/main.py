import os
import datetime
import boto3

lambdas = ['CreateRecipe', 'GetRecipes', 'GetRecipe', 'DeleteRecipe']

def handler(event, context):
    cloudwatch = boto3.client('cloudwatch')
    
    # Define time range for the last 24 hours
    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(days=1)
    
    report = "EnPlace Daily Report:\n\n"
    
    # Get Cognito signups count
    cognito_response = cloudwatch.get_metric_statistics(
        Namespace='AWS/Cognito',
        MetricName='SignUpSuccess',
        Dimensions=[
            {'Name': 'UserPoolId', 'Value': os.getenv('USER_POOL_ID')}
        ],
        StartTime=start_time,
        EndTime=end_time,
        Period=86400,
        Statistics=['Sum']
    )
    signups = round(cognito_response['Datapoints'][0]['Sum']) if cognito_response['Datapoints'] else 0
    report += f"User Signups: {signups}\n"
    
    # Get Lambda invocation counts
    for functionName in lambdas:
        response = cloudwatch.get_metric_statistics(
            Namespace='AWS/Lambda',
            MetricName='Invocations',
            Dimensions=[
                {'Name': 'FunctionName', 'Value': functionName}
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=86400,
            Statistics=['Sum']
        )
        invocations = round(response['Datapoints'][0]['Sum']) if response['Datapoints'] else 0
        report += f"{functionName} Invocations: {invocations}\n"
    
    return {
        'statusCode': 200,
        'body': report
    }
