
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
            The information provided by ProHub ("we," "us," or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>
          <h3>Professional Disclaimer</h3>
          <p>
            The site cannot and does not contain medical or fitness advice. The health, fitness, and nutritional information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals (such as a doctor or certified personal trainer). The use or reliance of any information contained on this site is solely at your own risk.
          </p>
          <h3>External Links Disclaimer</h3>
          <p>
            The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
          </p>
          <h3>Testimonials Disclaimer</h3>
          <p>
            The site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users. We do not claim, and you should not assume, that all users will have the same experiences. Your individual results may vary.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
