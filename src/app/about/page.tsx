
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>About ProHub</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to ProHub, your premier destination for high-quality articles and insights on fitness, health, and nutrition. We are dedicated to providing you with reliable, well-researched content to help you on your wellness journey.
          </p>
          <p>
            Founded by Santosh Kanojiya, ProHub was born from a passion for health and a desire to create a community where individuals can find trustworthy information. Santosh believed that everyone deserves access to clear, concise, and practical advice to achieve their health and fitness goals.
          </p>
          <p>
            Our mission is to empower you with knowledge. Whether you're looking for workout routines, nutrition plans, yoga techniques, or general wellness tips, our extensive library of articles covers a wide range of topics. We strive to be your trusted partner in building a healthier, stronger you.
          </p>
          <p>
            Thank you for visiting. We hope you enjoy the content we have to offer. If you have any questions or comments, please don't hesitate to reach out.
          </p>
          <p>
            Sincerely,
            <br />
            Santosh Kanojiya and the ProHub Team
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
