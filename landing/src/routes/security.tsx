import { createFileRoute } from '@tanstack/react-router';
import { Security } from '@/components/Security';

export const Route = createFileRoute('/security')({
  component: Security,
});