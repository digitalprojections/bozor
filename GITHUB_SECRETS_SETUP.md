# GitHub Actions Secrets Configuration

Add these secrets to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

## Required Secrets

### AWS Credentials

**Name:** `AWS_ACCESS_KEY_ID`
**Value:** Your AWS IAM user access key
```
AKIA1234567890ABCDEF
```

**Name:** `AWS_SECRET_ACCESS_KEY`
**Value:** Your AWS IAM user secret key
```
wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Name:** `AWS_ACCOUNT_ID`
**Value:** Your 12-digit AWS account ID (find in AWS Console → Account)
```
123456789012
```

**Name:** `AWS_REGION`
**Value:** AWS region for ECR and EC2
```
us-east-1
```

### ECR Repository

**Name:** `ECR_REPOSITORY`
**Value:** Name of your ECR repository
```
bozor
```

### EC2 Access

**Name:** `EC2_HOST`
**Value:** EC2 instance public IP or DNS name
```
ec2-52-123-45-67.compute-1.amazonaws.com
```

**Name:** `EC2_USER`
**Value:** EC2 instance SSH user (default for Ubuntu AMI)
```
ubuntu
```

**Name:** `EC2_SSH_KEY`
**Value:** Contents of your PEM file (entire file, with newlines)
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdefgh...
...
-----END RSA PRIVATE KEY-----
```

## Optional Secrets

### Slack Notifications

**Name:** `SLACK_WEBHOOK`
**Value:** Your Slack webhook URL (for deployment notifications)
```
https://hooks.slack.com/services/TXXX/BXXX/XXXX
```

## How to Get These Values

### AWS Credentials

1. Log in to AWS Console
2. Go to IAM → Users
3. Select the `bozor-app` user
4. Go to "Security credentials" tab
5. Under "Access keys", create new key if needed
6. Copy **Access key ID** and **Secret access key**

### AWS Account ID

1. Log in to AWS Console
2. Click account menu (top right)
3. Copy the 12-digit account ID

### EC2 Host

1. Log in to AWS Console
2. Go to EC2 → Instances
3. Select your Bozor instance
4. In details, find "Public IPv4 address" or "Public IPv4 DNS"

### EC2 SSH Key

1. Locate your `bozor-deploy-key.pem` file locally
2. Open it with a text editor
3. Copy entire contents (including BEGIN/END lines)
4. Paste into GitHub Secret

### Slack Webhook

1. Log in to Slack workspace
2. Go to https://api.slack.com/apps
3. Create New App → From scratch
4. Name: "Bozor Deployment" → Create App
5. Go to "Incoming Webhooks" → Activate
6. "Add New Webhook to Workspace"
7. Select channel and "Allow"
8. Copy the Webhook URL

## Verification Steps

After adding secrets, verify they are set correctly:

```bash
# Clone the repo locally
git clone https://github.com/yourusername/bozor.git
cd bozor

# Check workflow file
cat .github/workflows/deploy.yml | grep -A 5 "secrets\."
```

Common secret references in workflow:
- `${{ secrets.AWS_ACCESS_KEY_ID }}`
- `${{ secrets.AWS_SECRET_ACCESS_KEY }}`
- `${{ secrets.AWS_ACCOUNT_ID }}`
- `${{ secrets.EC2_HOST }}`
- `${{ secrets.EC2_USER }}`
- `${{ secrets.EC2_SSH_KEY }}`

## Troubleshooting

### Deployment fails with "Permission denied"

**Cause:** `EC2_SSH_KEY` is invalid or malformed
**Solution:** 
1. Ensure the PEM file is copied exactly, including BEGIN/END lines
2. Check for extra spaces or missing newlines
3. Try regenerating the key and updating the secret

### Deployment fails with "Unknown host"

**Cause:** `EC2_HOST` is incorrect or instance is stopped
**Solution:**
1. Verify instance is running in AWS Console
2. Check the public IP/DNS in EC2 details
3. Test SSH connection locally: `ssh -i key.pem ubuntu@<EC2_HOST>`

### Deployment fails with "Access Denied" to S3/ECR

**Cause:** AWS credentials lack permissions
**Solution:**
1. Verify IAM user has S3 and ECR policies attached
2. Check access key is active in IAM console
3. Ensure credentials haven't been rotated on AWS side

### Workflow doesn't trigger

**Cause:** Secrets are not properly set
**Solution:**
1. Go to Settings → Secrets and verify all secrets are present
2. Check branch name is `main` or `production` (or update workflow)
3. Look at Actions tab for workflow status and errors

## Security Best Practices

✅ **Rotate secrets** every 90 days
✅ **Never share** GitHub secrets with others
✅ **Use least privilege** - only grant required permissions
✅ **Monitor** AWS CloudTrail for all actions
✅ **Disable** old access keys and rotate regularly
✅ **Use IAM policies** to restrict S3/ECR access to specific buckets
✅ **Enable MFA** on AWS account

## Revoking Compromised Secrets

If any secret is accidentally exposed:

1. **Immediately** revoke the AWS access key in IAM console
2. Generate a new access key
3. Update GitHub Secret with new value
4. Rotate SSH key pair and update `EC2_SSH_KEY` secret
5. Review AWS CloudTrail for any suspicious activity

---

**Remember:** Keep secrets secret! Never commit them to Git.
