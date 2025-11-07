
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
          <p>By accessing and using ProHub (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these, you are not authorized to use this Service.</p>

          <h3>2. User Conduct</h3>
          <p>You agree to use the website only for lawful purposes. You are prohibited from posting on or transmitting through the website any material that is disruptive or harassing, or that infringes on the intellectual property rights of others.</p>
          
          <h3>3. Content</h3>
          <p>The articles and all other content on this site are for informational and entertainment purposes only. The opinions expressed are those of the authors. While we strive for accuracy, we make no guarantees about the completeness, reliability, or accuracy of this information.</p>

          <h3>4. Intellectual Property</h3>
          <p>All content on this site, including text, graphics, logos, and images, is the property of ProHub or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any part of the website without our prior written permission.</p>

          <h3>5. Limitation of Liability</h3>
          <p>In no event shall ProHub or its owner be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.</p>
          
          <h3>6. Termination</h3>
          <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>

          <h3>7. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.</p>
        </CardContent>
      </Card>
    </div>
  );
}
