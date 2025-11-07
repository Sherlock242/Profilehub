
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Have questions? We'd love to hear from you.
          </p>
          <p>
            While we don't have a traditional contact form (we're a bit too modern for that), you can reach out to us via the digital ether.
          </p>
          <ul>
            <li><strong>Email:</strong> You can send your thoughts to `contact@prohub.example.com` (Note: This is a placeholder and is not monitored).</li>
            <li><strong>Telepathy:</strong> If you are a level 5 telepath, you can project your thoughts directly to our server cluster. Please aim for the one blinking green.</li>
            <li><strong>Smoke Signals:</strong> We have a scout on a nearby hill. Three puffs for "I like your app," and a continuous stream of smoke for "I found a bug."</li>
          </ul>
          <p>
            We appreciate your feedback and will get back to you as soon as possible, provided we can decode your message.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
