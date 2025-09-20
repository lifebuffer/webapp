export function PrivacyPolicy() {
  return (
    <div className="bg-black text-white">
      {/* Header Section */}
      <section className="px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="mb-4 font-medium text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Introduction */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">Introduction</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                At LifeBuffer, operated by nlsio LLC, we take your privacy seriously.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website and use our services.
                Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                site.
              </p>
              <p>
                We reserve the right to make changes to this Privacy Policy at
                any time and for any reason. We will alert you about any changes
                by updating the "Last updated" date of this Privacy Policy.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Information We Collect
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Personal Data
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <p>
                    We may collect personally identifiable information, such as:
                  </p>
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Name and email address</li>
                    <li>Company information</li>
                    <li>Contact preferences</li>
                    <li>Account authentication data</li>
                    <li>
                      Activity data and tracking preferences
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>Usage Data</h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <p>
                    We automatically collect certain information when you visit
                    our website:
                  </p>
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>IP address and browser type</li>
                    <li>Operating system and device information</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Usage patterns and feature interactions</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Voice and Activity Data
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <p>When you use LifeBuffer's tracking features:</p>
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>
                      Voice recordings are processed for transcription only and then deleted
                    </li>
                    <li>We store the resulting text of your activities and notes</li>
                    <li>We maintain activity history and context organization</li>
                    <li>
                      All personal data stays encrypted and under your control
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className='ml-6 list-disc space-y-2'>
                <li>Provide, operate, and maintain our services</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Understand and analyze how you use our services</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
                <li>Communicate with you for customer service and support</li>
                <li>
                  Send you technical notices, updates, and security alerts
                </li>
                <li>Process your transactions and manage your account</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </div>
          </div>

          {/* Data Storage and Security */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Data Storage and Security
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                All data is hosted by Upsun (https://upsun.com) with servers
                located in Switzerland, providing enhanced data protection.
              </p>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Security Measures
                </h3>
                <ul className='ml-6 list-disc space-y-2'>
                  <li>Data hosted in Switzerland by Upsun</li>
                  <li>Encryption in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication</li>
                  <li>GDPR compliance for all users</li>
                  <li>Swiss data protection laws</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Data Retention
                </h3>
                <p>
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes outlined in this Privacy
                  Policy, unless a longer retention period is required by law.
                </p>
              </div>
            </div>
          </div>

          {/* Sharing Your Information */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Sharing Your Information
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                situations:
              </p>
              <ul className='ml-6 list-disc space-y-2'>
                <li>
                  <strong>With your consent:</strong> When you explicitly
                  authorize us to share your information
                </li>
                <li>
                  <strong>Service providers:</strong> With trusted third-party
                  vendors who assist in operating our services
                </li>
                <li>
                  <strong>Legal compliance:</strong> When required by law or to
                  protect our rights and safety
                </li>
                <li>
                  <strong>Business transfers:</strong> In connection with a
                  merger, sale, or acquisition of our company
                </li>
              </ul>
            </div>
          </div>

          {/* Your Rights and Choices */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Your Rights and Choices
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                You have the following rights regarding your personal
                information:
              </p>
              <ul className='ml-6 list-disc space-y-2'>
                <li>
                  <strong>Access:</strong> Request access to your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  data
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your
                  personal data
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of
                  processing
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us at{' '}
                <a
                  className="text-blue-400 hover:text-blue-300"
                  href="mailto:privacy@lifebuffer.com"
                >
                  privacy@lifebuffer.com
                </a>
              </p>
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to track
                activity on our service and store certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Types of Cookies We Use
                </h3>
                <ul className='ml-6 list-disc space-y-2'>
                  <li>
                    <strong>Essential cookies:</strong> Required for the website
                    to function properly
                  </li>
                  <li>
                    <strong>Analytics cookies:</strong> Help us understand how
                    visitors use our website
                  </li>
                  <li>
                    <strong>Functional cookies:</strong> Remember your
                    preferences and settings
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Third-Party Services
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Our service may contain links to third-party websites or
                services that are not owned or controlled by LifeBuffer. We have
                no control over and assume no responsibility for the content,
                privacy policies, or practices of any third-party websites or
                services.
              </p>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  AI Services
                </h3>
                <p>
                  When you use our AI categorization and insights features, we use
                  trusted third-party AI services to process your activity text.
                  No voice recordings are shared - only the transcribed text for
                  categorization purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Data Location and Storage */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Data Location and Storage
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                All your data is stored in Switzerland through our hosting
                provider Upsun (https://upsun.com). Switzerland has some of
                the world's strongest data protection laws and is not subject
                to foreign surveillance programs. This ensures your data
                remains secure and private.
              </p>
              <p>
                We do not transfer your personal data outside of Switzerland
                except when required for specific AI processing services,
                and only the minimum necessary data is shared for those purposes.
              </p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Children's Privacy
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Our service is not directed to individuals under the age of 13.
                We do not knowingly collect personal information from children
                under 13. If you become aware that a child has provided us with
                personal information, please contact us immediately.
              </p>
            </div>
          </div>

          {/* Changes to Privacy Policy */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">Contact Us</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Company:</strong> nlsio LLC
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    className="text-blue-400 hover:text-blue-300"
                    href="mailto:privacy@lifebuffer.com"
                  >
                    privacy@lifebuffer.com
                  </a>
                </p>
                <p>
                  <strong>General Contact:</strong>{' '}
                  <a
                    className="text-blue-400 hover:text-blue-300"
                    href="mailto:hello@lifebuffer.com"
                  >
                    hello@lifebuffer.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
