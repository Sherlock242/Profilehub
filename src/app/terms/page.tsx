
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using ProHub, you accept and agree to be bound by the terms and provision of this agreement. Also, by using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

          <h3>2. Voting Rights</h3>
          <p>All votes are final. No take-backs. You are granted one vote per showdown. Use it wisely. Creating multiple accounts to vote for yourself is frowned upon and may result in digital frowns from the admin team.</p>
          
          <h3>3. Content</h3>
          <p>All articles are generated for entertainment purposes. Any resemblance to actual persons, living or dead, or actual events is purely coincidental. The opinions expressed in articles are those of the AI author and do not necessarily reflect the views of... well, anyone else, really.</p>

          <h3>4. Limitation of Liability</h3>
          <p>In no event shall ProHub be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. We are not responsible for any loss of productivity that may occur from endlessly voting on profiles.</p>
          
          <h3>5. Termination</h3>
          <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>
        </CardContent>
      </Card>
    </div>
  );
}
