const endpoints = {
  'github.com': [
    {
      pattern: /^https:\/\/github\.com\/[^\/]+\/?$/,
      apiDocUrl: 'https://developer.github.com/v3/users/',
    },
    {
      pattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/,
      apiDocUrl: 'https://developer.github.com/v3/repos/',
    },
    {
      pattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues(\/.*|$)/,
      apiDocUrl: 'https://developer.github.com/v3/issues/',
    },
    {
      pattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/commits(\/.*|$)/,
      apiDocUrl: 'https://developer.github.com/v3/repos/commits/',
    },
    {
      pattern: /^https:\/\/github\.com(\/.*|$)/,
      apiDocUrl: 'https://developer.github.com/v3/',
    },
  ],
  'console.aws.amazon.com': [
    {
      pattern: /https:\/\/console\.aws\.amazon\.com\/ec2\/.*#Instances\b/,
      apiDocUrl:
        'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html',
    },
    {
      pattern: /https:\/\/console\.aws\.amazon\.com\/ec2(\/.*|$)/,
      apiDocUrl:
        'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Welcome.html',
    },
    {
      pattern: /https:\/\/console\.aws\.amazon\.com\/cloudfront(\/.*|$)/,
      apiDocUrl:
        'https://docs.aws.amazon.com/cloudfront/latest/APIReference/Welcome.html',
    },
    {
      pattern: /https:\/\/console\.aws\.amazon\.com\/route53(\/.*|$)/,
      apiDocUrl:
        'https://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html',
    },
  ],
  's3.console.aws.amazon.com': [
    {
      pattern: /https:\/\/s3\.console\.aws\.amazon\.com\/s3(\/.*|$)/,
      apiDocUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html',
    },
  ],
}

export default {
  run({ message, args }) {
    const url = args[0]

    let urlObj = {}
    try {
      urlObj = new URL(url)
    } catch (e) {
      // ignore
    }
    const results = []
    const siteEndpoints = endpoints[urlObj.host] || []
    for (let { pattern, apiDocUrl } of siteEndpoints) {
      if (pattern.test(url)) {
        results.push({ type: 'link', url: apiDocUrl, text: apiDocUrl })
        break
      }
    }
    if (results.length > 0) {
      return results
    } else {
      return [{ type: 'error', code: 'not_found' }]
    }
  },
  help: {
    args: ['url'],
    details: 'find api docs for a url',
  },
}
