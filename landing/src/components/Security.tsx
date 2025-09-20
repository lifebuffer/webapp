// import { CheckCircle, Lock, Server, Shield } from 'lucide-react';

export function Security() {
  return (
    <div className="bg-black text-white">
      {/* Header Section */}
      <section className="px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="mb-4 font-medium text-4xl lg:text-5xl">
              Security at LifeBuffer
            </h1>
            <p className="text-gray-400 text-lg">
              Privacy-first security for your personal tracking data
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* Security Overview */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Our Security Commitment
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                At LifeBuffer, security is not an afterthought—it's built into
                the foundation of our platform. We understand that your activity
                data contains sensitive information about your work,
                accomplishments, and personal progress. That's why we've
                implemented privacy-first security measures to protect your data
                at every level.
              </p>
              <p>
                Our security approach follows industry best practices and
                compliance standards, ensuring that your life tracking workflow
                remains secure without compromising on functionality or user
                experience.
              </p>
            </div>
          </div>

          {/* Compliance Certifications */}
          {/* <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">Compliance & Certifications</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="mb-3 font-medium text-white text-xl">SOC 2 Type II</h3>
                <p className="text-gray-400 leading-relaxed">
                  Independently audited and certified for security, availability, processing integrity, 
                  confidentiality, and privacy controls.
                </p>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-3 font-medium text-white text-xl">GDPR Compliant</h3>
                <p className="text-gray-400 leading-relaxed">
                  Full compliance with the General Data Protection Regulation, ensuring proper handling 
                  of European user data and privacy rights.
                </p>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <Lock className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-3 font-medium text-white text-xl">ISO 27001</h3>
                <p className="text-gray-400 leading-relaxed">
                  Information security management system certified to international standards for 
                  systematic security risk management.
                </p>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                  <Server className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="mb-3 font-medium text-white text-xl">HIPAA Ready</h3>
                <p className="text-gray-400 leading-relaxed">
                  Available Business Associate Agreements (BAA) for healthcare organizations requiring 
                  HIPAA compliance for their documentation.
                </p>
              </div>
            </div>
          </div> */}

          {/* Data Protection */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">Data Protection</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>Encryption</h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>
                      <strong>Data at Rest:</strong> AES-256 encryption for all
                      stored data
                    </li>
                    <li>
                      <strong>Data in Transit:</strong> TLS 1.3 encryption for
                      all communications
                    </li>
                    <li>
                      <strong>Database Encryption:</strong> Transparent data
                      encryption (TDE) for database storage
                    </li>
                    <li>
                      <strong>Backup Encryption:</strong> All backups encrypted
                      with separate key management
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Data Sovereignty
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <p>
                    Your data remains in your control. LifeBuffer stores your
                    activity data securely, with full export capabilities and
                    privacy controls:
                  </p>
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>
                      Voice recordings are processed for transcription only and
                      then deleted
                    </li>
                    <li>
                      We store only the transcribed text and activity metadata
                    </li>
                    <li>You can export or delete your data at any time</li>
                    <li>
                      Regional data residency options available for privacy
                      compliance
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Backup and Recovery
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Automated daily backups with 30-day retention</li>
                    <li>
                      Cross-region backup replication for disaster recovery
                    </li>
                    <li>Point-in-time recovery capabilities</li>
                    <li>Regular backup integrity testing and validation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Infrastructure Security
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Cloud Infrastructure
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>
                      Hosted on enterprise-grade cloud infrastructure
                      (AWS/Azure)
                    </li>
                    <li>
                      Multi-availability zone deployment for high availability
                    </li>
                    <li>
                      Auto-scaling and load balancing for performance and
                      reliability
                    </li>
                    <li>DDoS protection and web application firewall (WAF)</li>
                    <li>Network segmentation and micro-segmentation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Network Security
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Virtual Private Cloud (VPC) isolation</li>
                    <li>
                      Network Access Control Lists (NACLs) and security groups
                    </li>
                    <li>
                      Intrusion detection and prevention systems (IDS/IPS)
                    </li>
                    <li>Regular network penetration testing</li>
                    <li>
                      VPN and private connectivity options for enterprise
                      customers
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Container Security
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Container image vulnerability scanning</li>
                    <li>Runtime security monitoring and threat detection</li>
                    <li>Immutable infrastructure and container deployment</li>
                    <li>Least privilege container execution</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Access Control & Authentication
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  User Authentication
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Multi-factor authentication (MFA) enforcement</li>
                    <li>
                      Single Sign-On (SSO) integration with SAML 2.0 and OIDC
                    </li>
                    <li>
                      Support for popular identity providers (Okta, Azure AD,
                      Google Workspace)
                    </li>
                    <li>Session management with automatic timeout</li>
                    <li>Device trust and conditional access policies</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Role-Based Access Control (RBAC)
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>
                      Granular permissions for personal data and activity
                      sharing
                    </li>
                    <li>
                      Individual user control over data access and retention
                    </li>
                    <li>Privacy-first default settings</li>
                    <li>Time-based data access controls</li>
                    <li>Regular access reviews and automated cleanup</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>API Security</h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>OAuth 2.0 and API key authentication</li>
                    <li>Rate limiting and throttling to prevent abuse</li>
                    <li>API gateway with request/response validation</li>
                    <li>Comprehensive API audit logging</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring and Incident Response */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Monitoring & Incident Response
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Security Monitoring
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>24/7 security operations center (SOC) monitoring</li>
                    <li>Real-time threat detection and alerting</li>
                    <li>Behavioral analytics and anomaly detection</li>
                    <li>Comprehensive audit logging and log retention</li>
                    <li>Security information and event management (SIEM)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Incident Response
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Formal incident response plan and procedures</li>
                    <li>Dedicated security incident response team</li>
                    <li>Automated incident classification and escalation</li>
                    <li>
                      Customer notification procedures for security incidents
                    </li>
                    <li>Post-incident analysis and remediation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className='font-medium text-white text-xl'>
                  Audit and Logging
                </h3>
                <div className="space-y-3 text-gray-300 leading-relaxed">
                  <ul className='ml-6 list-disc space-y-2'>
                    <li>Comprehensive audit trails for all user actions</li>
                    <li>
                      Tamper-evident log storage and integrity verification
                    </li>
                    <li>Log export capabilities for customer security teams</li>
                    <li>
                      Real-time audit log streaming for enterprise customers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerability Management */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Vulnerability Management
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <ul className='ml-6 list-disc space-y-2'>
                <li>
                  Regular vulnerability assessments and penetration testing
                </li>
                <li>Automated dependency scanning and security patching</li>
                <li>Bug bounty program with responsible disclosure policy</li>
                <li>Security code reviews for all application changes</li>
                <li>Continuous security testing in CI/CD pipeline</li>
              </ul>
            </div>
          </div>

          {/* Employee Security */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Employee Security
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <ul className='ml-6 list-disc space-y-2'>
                <li>Comprehensive background checks for all employees</li>
                <li>Regular security awareness training and testing</li>
                <li>Least privilege access principles for internal systems</li>
                <li>Secure development lifecycle (SDLC) training</li>
                <li>Annual security certifications and assessments</li>
              </ul>
            </div>
          </div>

          {/* Physical Security */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Physical Security
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                LifeBuffer operates on cloud infrastructure with
                industry-leading physical security:
              </p>
              <ul className='ml-6 list-disc space-y-2'>
                <li>Data centers with 24/7 physical security and monitoring</li>
                <li>
                  Biometric access controls and multi-factor authentication
                </li>
                <li>Environmental controls and redundant power systems</li>
                <li>Secure hardware destruction and disposal procedures</li>
              </ul>
            </div>
          </div>

          {/* Security Transparency */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Security Transparency
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We believe in transparency about our security practices:</p>
              <ul className='ml-6 list-disc space-y-2'>
                <li>Public security status page with real-time updates</li>
                <li>Regular security bulletins and advisories</li>
                <li>Annual security reports and audit summaries</li>
                <li>Open communication channels for security questions</li>
              </ul>
            </div>
          </div>

          {/* Contact Security Team */}
          <div className="space-y-6">
            <h2 className="font-medium text-2xl text-white">
              Contact Our Security Team
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Have questions about our security practices or need to report a
                security issue?
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Security Team:</strong>{' '}
                  <a
                    className="text-blue-400 hover:text-blue-300"
                    href="mailto:security@lifebuffer.com"
                  >
                    security@lifebuffer.com
                  </a>
                </p>
                <p>
                  <strong>Vulnerability Reports:</strong>{' '}
                  <a
                    className="text-blue-400 hover:text-blue-300"
                    href="mailto:security-reports@lifebuffer.com"
                  >
                    security-reports@lifebuffer.com
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
              <p className='text-gray-500 text-sm'>
                For security vulnerabilities, please use our responsible
                disclosure process. We typically respond to security reports
                within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
