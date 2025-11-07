
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Your privacy is important to us. It is ProHub's policy to respect your privacy regarding any information we may collect from you across our website.</p>

          <h3>Information We Collect</h3>
          <p>We only ask for personal information when we truly need it to provide a service to you, such as creating an account or leaving comments. We collect it by fair and lawful means, with your knowledge and consent. We primarily collect information you provide, such as your name and email address.</p>

          <h3>How We Use Your Information</h3>
          <p>We use the information we collect in various ways, including to:</p><ul><li>Provide, operate, and maintain our website</li><li>Improve, personalize, and expand our website</li><li>Understand and analyze how you use our website</li><li>Develop new products, services, features, and functionality</li><li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li><li>Send you emails</li><li>Find and prevent fraud</li></ul>

          <h3>Log Files</h3>
          <p>ProHub follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
          
          <h3>Cookies</h3>
          <p>Like any other website, ProHub uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

          <h3>Security</h3>
          <p>We are committed to protecting your data. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security, as no method of transmission over the Internet is 100% secure.</p>
        </CardContent>
      </Card>
    </div>
  );
}
