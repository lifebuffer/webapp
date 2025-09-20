import { createFileRoute } from '@tanstack/react-router';
import { TermsOfService } from '@/components/TermsOfService';

export const Route = createFileRoute('/terms')({
  component: TermsOfService,
});