
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
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We primarily collect your name, email, and avatar image, all of which you provide.</p>

          <h3>How We Use Your Information</h3>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Allow you to vote and be voted on</li>
            <li>Prevent digital skullduggery</li>
            <li>Understand and analyze how you use our website</li>
          </ul>

          <h3>Security</h3>
          <p>We are committed to protecting your data and have implemented measures to secure it. However, remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security. So, maybe don't use your most secret password.</p>
          
          <h3>Cookies</h3>
          <p>We use cookies to make your experience better. A cookie is a small piece of data stored on your device. We use them for session management. We do not use them to track you across the internet, and we definitely do not sell your cookie data. We like our cookies with milk, not with third-party advertisers.</p>
        </CardContent>
      </Card>
    </div>
  );
}
