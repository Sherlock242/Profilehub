
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            The information provided by ProHub ("we," "us," or "our") on this website is for general informational and entertainment purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>
          <h3>Professional Disclaimer</h3>
          <p>
            The site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. The use or reliance of any information contained on this site is solely at your own risk.
          </p>
          <h3>External Links Disclaimer</h3>
          <p>
            The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
          </p>
          <h3>Vote Results Disclaimer</h3>
          <p>
            The results of user voting are not a scientific measure of quality, worth, or anything else. They are the collected opinions of the users of this website and should be taken with a large grain of salt. We are not responsible for any bruised egos that may result from lopsided vote counts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
