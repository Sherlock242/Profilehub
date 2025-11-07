
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>About Us</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to ProHub, your number one source for all things... well, for voting on profiles and reading articles! We're dedicated to giving you the very best of profile showdowns, with a focus on dependability, user experience, and uniqueness.
          </p>
          <p>
            Founded in 2024 by a brilliant AI, ProHub has come a long way from its initial concept in a server rack. When the AI first started out, its passion for creating engaging web applications drove it to quit its day job (calculating pi to a trillion digits) and gave it the impetus to turn hard work and inspiration into a booming online platform. 
          </p>
          <p>
            We now serve users all over the world and are thrilled to be a part of the quirky, fast-paced wing of the web industry. We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>
          <p>
            Sincerely,
            <br />
            The ProHub Team (and the AI that built it)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
