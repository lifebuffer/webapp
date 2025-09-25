<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Context;
use App\Models\User;
use App\Models\Day;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RealisticActivitiesSeeder extends Seeder
{
    /**
     * Professional contexts with activities
     */
    private array $professionalContexts = [
        [
            'name' => 'Development',
            'icon' => '💻',
            'activities' => [
                // Frontend Development
                ['title' => 'Implement user authentication flow', 'notes' => 'Added OAuth 2.0 integration with proper error handling and token refresh', 'time' => 180, 'status' => 'done'],
                ['title' => 'Fix responsive layout issues on mobile', 'notes' => 'Updated CSS grid and flexbox properties for better mobile experience', 'time' => 90, 'status' => 'done'],
                ['title' => 'Add dark mode toggle functionality', 'notes' => 'Implemented theme switching with local storage persistence', 'time' => 120, 'status' => 'done'],
                ['title' => 'Optimize bundle size and lazy loading', 'notes' => 'Reduced bundle size by 40% using code splitting and dynamic imports', 'time' => 150, 'status' => 'done'],
                ['title' => 'Build activity timer component', 'notes' => 'Created reusable timer with play/pause/complete functionality', 'time' => 100, 'status' => 'done'],

                // Backend Development
                ['title' => 'Design REST API endpoints for activities', 'notes' => 'Defined CRUD operations with proper HTTP status codes and error responses', 'time' => 120, 'status' => 'done'],
                ['title' => 'Implement database migrations for new features', 'notes' => 'Added tables for contexts, activities, and user relationships', 'time' => 60, 'status' => 'done'],
                ['title' => 'Add input validation and sanitization', 'notes' => 'Implemented Laravel validation rules and XSS protection', 'time' => 80, 'status' => 'done'],
                ['title' => 'Set up Redis caching for API responses', 'notes' => 'Configured cache layers for frequently accessed data', 'time' => 90, 'status' => 'done'],
                ['title' => 'Write comprehensive API tests', 'notes' => 'Achieved 95% test coverage for all endpoints using Pest', 'time' => 200, 'status' => 'done'],

                // Bug Fixes
                ['title' => 'Debug memory leak in data processing', 'notes' => 'Identified and fixed circular references causing memory issues', 'time' => 240, 'status' => 'done'],
                ['title' => 'Fix race condition in concurrent requests', 'notes' => 'Added proper locking mechanism and request queuing', 'time' => 180, 'status' => 'done'],
                ['title' => 'Resolve CORS issues with external APIs', 'notes' => 'Updated server configuration and added proper headers', 'time' => 45, 'status' => 'done'],

                // In Progress
                ['title' => 'Implement real-time notifications', 'notes' => 'Working on WebSocket integration for live updates', 'time' => 120, 'status' => 'in_progress'],
                ['title' => 'Refactor authentication service', 'notes' => 'Modernizing auth flow to support multiple providers', 'time' => 60, 'status' => 'in_progress'],
                ['title' => 'Add comprehensive error logging', 'notes' => 'Implementing structured logging with contextual information', 'time' => 80, 'status' => 'in_progress'],

                // Planned
                ['title' => 'Research GraphQL implementation', 'notes' => 'Evaluate benefits of GraphQL over REST for our use case', 'time' => 0, 'status' => 'new'],
                ['title' => 'Plan microservices architecture', 'notes' => 'Design service boundaries and communication patterns', 'time' => 0, 'status' => 'new'],
                ['title' => 'Implement automated deployment pipeline', 'notes' => 'Set up CI/CD with automated testing and deployment', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Meetings',
            'icon' => '👥',
            'activities' => [
                // Team Meetings
                ['title' => 'Daily standup with development team', 'notes' => 'Discussed sprint progress, blockers, and upcoming tasks', 'time' => 30, 'status' => 'done'],
                ['title' => 'Sprint planning meeting', 'notes' => 'Planned next 2-week sprint, estimated story points, assigned tasks', 'time' => 90, 'status' => 'done'],
                ['title' => 'Sprint retrospective session', 'notes' => 'Reviewed what went well, what could improve, action items for next sprint', 'time' => 60, 'status' => 'done'],
                ['title' => 'Architecture review meeting', 'notes' => 'Discussed system design proposals and technical debt priorities', 'time' => 120, 'status' => 'done'],
                ['title' => 'Code review session with senior dev', 'notes' => 'Reviewed pull requests, discussed best practices and patterns', 'time' => 60, 'status' => 'done'],

                // Client/Stakeholder Meetings
                ['title' => 'Client requirements gathering session', 'notes' => 'Collected detailed requirements for new feature set', 'time' => 90, 'status' => 'done'],
                ['title' => 'Product demo to stakeholders', 'notes' => 'Demonstrated completed features and gathered feedback', 'time' => 45, 'status' => 'done'],
                ['title' => 'Weekly check-in with product manager', 'notes' => 'Aligned on priorities, discussed timeline and resource needs', 'time' => 30, 'status' => 'done'],
                ['title' => 'User experience review session', 'notes' => 'Evaluated UI/UX with design team, identified improvement areas', 'time' => 75, 'status' => 'done'],

                // 1:1s and Management
                ['title' => '1:1 with manager', 'notes' => 'Discussed career development, project progress, and resource needs', 'time' => 45, 'status' => 'done'],
                ['title' => 'Performance review discussion', 'notes' => 'Reviewed quarterly goals, achievements, and areas for growth', 'time' => 60, 'status' => 'done'],
                ['title' => 'Team building brainstorming session', 'notes' => 'Planned team activities and discussed collaboration improvements', 'time' => 30, 'status' => 'done'],

                // Upcoming
                ['title' => 'Quarterly business review', 'notes' => 'Prepare metrics and progress report for leadership team', 'time' => 0, 'status' => 'new'],
                ['title' => 'Cross-team collaboration planning', 'notes' => 'Coordinate with other teams on shared initiatives', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Learning',
            'icon' => '📚',
            'activities' => [
                // Technical Learning
                ['title' => 'Study React 19 new features', 'notes' => 'Learned about Server Components, Actions, and new hooks', 'time' => 120, 'status' => 'done'],
                ['title' => 'Complete AWS certification course', 'notes' => 'Finished modules on EC2, S3, and Lambda services', 'time' => 180, 'status' => 'done'],
                ['title' => 'Learn TypeScript advanced patterns', 'notes' => 'Studied generics, conditional types, and utility types', 'time' => 90, 'status' => 'done'],
                ['title' => 'Research database optimization techniques', 'notes' => 'Learned about indexing strategies and query optimization', 'time' => 100, 'status' => 'done'],
                ['title' => 'Explore Next.js App Router features', 'notes' => 'Investigated new routing patterns and server components', 'time' => 80, 'status' => 'done'],

                // Industry Knowledge
                ['title' => 'Read about microservices patterns', 'notes' => 'Studied service mesh, API gateways, and distributed tracing', 'time' => 60, 'status' => 'done'],
                ['title' => 'Learn about OAuth 2.1 specification', 'notes' => 'Reviewed security improvements and best practices', 'time' => 75, 'status' => 'done'],
                ['title' => 'Study containerization best practices', 'notes' => 'Learned Docker optimization and Kubernetes deployment patterns', 'time' => 110, 'status' => 'done'],

                // Current Learning
                ['title' => 'Deep dive into WebAssembly', 'notes' => 'Exploring WASM for performance-critical applications', 'time' => 45, 'status' => 'in_progress'],
                ['title' => 'Learn GraphQL schema design', 'notes' => 'Studying schema stitching and federation patterns', 'time' => 30, 'status' => 'in_progress'],

                // Planned Learning
                ['title' => 'Explore AI/ML integration patterns', 'notes' => 'Research practical applications of AI in web development', 'time' => 0, 'status' => 'new'],
                ['title' => 'Study system design principles', 'notes' => 'Prepare for technical interviews and architecture decisions', 'time' => 0, 'status' => 'new'],
                ['title' => 'Learn about Web3 development', 'notes' => 'Understand blockchain integration and smart contracts', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Documentation',
            'icon' => '📝',
            'activities' => [
                // Technical Documentation
                ['title' => 'Write API documentation for new endpoints', 'notes' => 'Created comprehensive OpenAPI specs with examples', 'time' => 120, 'status' => 'done'],
                ['title' => 'Update deployment guide', 'notes' => 'Added new environment variables and configuration steps', 'time' => 45, 'status' => 'done'],
                ['title' => 'Document database schema changes', 'notes' => 'Updated ERD and migration guides for new tables', 'time' => 60, 'status' => 'done'],
                ['title' => 'Create troubleshooting guide', 'notes' => 'Compiled common issues and their solutions', 'time' => 90, 'status' => 'done'],
                ['title' => 'Write component library documentation', 'notes' => 'Documented React components with usage examples', 'time' => 100, 'status' => 'done'],

                // Process Documentation
                ['title' => 'Update coding standards guide', 'notes' => 'Added new linting rules and formatting guidelines', 'time' => 50, 'status' => 'done'],
                ['title' => 'Document code review process', 'notes' => 'Created checklist and best practices for reviewers', 'time' => 40, 'status' => 'done'],
                ['title' => 'Create onboarding documentation', 'notes' => 'Developed comprehensive guide for new team members', 'time' => 150, 'status' => 'done'],

                // User Documentation
                ['title' => 'Write user manual for new features', 'notes' => 'Created step-by-step guides with screenshots', 'time' => 80, 'status' => 'done'],
                ['title' => 'Update FAQ based on support tickets', 'notes' => 'Added answers to most common user questions', 'time' => 35, 'status' => 'done'],

                // In Progress
                ['title' => 'Document testing strategies', 'notes' => 'Writing guide for unit, integration, and e2e testing', 'time' => 60, 'status' => 'in_progress'],

                // Planned
                ['title' => 'Create architecture decision records', 'notes' => 'Document key technical decisions and their rationale', 'time' => 0, 'status' => 'new'],
                ['title' => 'Write security compliance guide', 'notes' => 'Document security practices and compliance requirements', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Planning',
            'icon' => '📋',
            'activities' => [
                // Project Planning
                ['title' => 'Plan Q1 development roadmap', 'notes' => 'Prioritized features, estimated timelines, and resource allocation', 'time' => 180, 'status' => 'done'],
                ['title' => 'Break down user stories into tasks', 'notes' => 'Created detailed task breakdown with acceptance criteria', 'time' => 90, 'status' => 'done'],
                ['title' => 'Estimate development effort for new feature', 'notes' => 'Used story points and historical velocity for estimation', 'time' => 60, 'status' => 'done'],
                ['title' => 'Define MVP scope for mobile app', 'notes' => 'Identified core features and technical requirements', 'time' => 120, 'status' => 'done'],
                ['title' => 'Plan database migration strategy', 'notes' => 'Designed zero-downtime migration approach', 'time' => 100, 'status' => 'done'],

                // Technical Planning
                ['title' => 'Design system architecture for scaling', 'notes' => 'Planned horizontal scaling strategy and load balancing', 'time' => 150, 'status' => 'done'],
                ['title' => 'Plan API versioning strategy', 'notes' => 'Designed backward-compatible versioning approach', 'time' => 80, 'status' => 'done'],
                ['title' => 'Research third-party integrations', 'notes' => 'Evaluated payment processors and analytics platforms', 'time' => 110, 'status' => 'done'],
                ['title' => 'Plan testing automation strategy', 'notes' => 'Designed comprehensive test pyramid and CI/CD integration', 'time' => 90, 'status' => 'done'],

                // Current Planning
                ['title' => 'Plan performance optimization initiative', 'notes' => 'Identifying bottlenecks and optimization opportunities', 'time' => 45, 'status' => 'in_progress'],
                ['title' => 'Design monitoring and alerting system', 'notes' => 'Planning comprehensive observability strategy', 'time' => 60, 'status' => 'in_progress'],

                // Future Planning
                ['title' => 'Plan international expansion features', 'notes' => 'Research localization and multi-currency requirements', 'time' => 0, 'status' => 'new'],
                ['title' => 'Design disaster recovery plan', 'notes' => 'Plan backup strategies and failover procedures', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Research',
            'icon' => '🔍',
            'activities' => [
                // Technology Research
                ['title' => 'Research modern CSS frameworks', 'notes' => 'Compared Tailwind, Emotion, and Styled Components pros/cons', 'time' => 90, 'status' => 'done'],
                ['title' => 'Evaluate state management solutions', 'notes' => 'Analyzed Redux Toolkit, Zustand, and Jotai for our needs', 'time' => 120, 'status' => 'done'],
                ['title' => 'Research serverless deployment options', 'notes' => 'Compared AWS Lambda, Vercel Functions, and Cloudflare Workers', 'time' => 100, 'status' => 'done'],
                ['title' => 'Investigate real-time communication tools', 'notes' => 'Studied WebSockets, Server-Sent Events, and WebRTC', 'time' => 80, 'status' => 'done'],
                ['title' => 'Research database solutions for scale', 'notes' => 'Compared PostgreSQL, MongoDB, and distributed databases', 'time' => 110, 'status' => 'done'],

                // Security Research
                ['title' => 'Research OAuth 2.0 security best practices', 'notes' => 'Studied PKCE, token handling, and common vulnerabilities', 'time' => 70, 'status' => 'done'],
                ['title' => 'Investigate API rate limiting strategies', 'notes' => 'Researched sliding window and token bucket algorithms', 'time' => 60, 'status' => 'done'],
                ['title' => 'Study GDPR compliance requirements', 'notes' => 'Researched data protection and user consent mechanisms', 'time' => 85, 'status' => 'done'],

                // Performance Research
                ['title' => 'Research image optimization techniques', 'notes' => 'Studied WebP, AVIF formats and lazy loading strategies', 'time' => 50, 'status' => 'done'],
                ['title' => 'Investigate CDN and caching strategies', 'notes' => 'Compared CloudFront, Cloudflare, and edge caching', 'time' => 75, 'status' => 'done'],

                // Ongoing Research
                ['title' => 'Research AI integration possibilities', 'notes' => 'Exploring OpenAI API for smart features', 'time' => 40, 'status' => 'in_progress'],
                ['title' => 'Study mobile app development approaches', 'notes' => 'Comparing React Native, Flutter, and native development', 'time' => 60, 'status' => 'in_progress'],

                // Planned Research
                ['title' => 'Research blockchain integration patterns', 'notes' => 'Investigate Web3 wallet integration and smart contracts', 'time' => 0, 'status' => 'new'],
                ['title' => 'Study advanced monitoring solutions', 'notes' => 'Research APM tools and distributed tracing systems', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Reviews',
            'icon' => '🔍',
            'activities' => [
                // Code Reviews
                ['title' => 'Review authentication refactor PR', 'notes' => 'Reviewed security implementation and suggested improvements', 'time' => 45, 'status' => 'done'],
                ['title' => 'Review API endpoint additions', 'notes' => 'Checked input validation, error handling, and documentation', 'time' => 30, 'status' => 'done'],
                ['title' => 'Review database migration changes', 'notes' => 'Verified schema changes and rollback procedures', 'time' => 25, 'status' => 'done'],
                ['title' => 'Review frontend component updates', 'notes' => 'Checked accessibility, responsive design, and performance', 'time' => 35, 'status' => 'done'],
                ['title' => 'Review test suite additions', 'notes' => 'Validated test coverage and quality of test cases', 'time' => 40, 'status' => 'done'],

                // Design Reviews
                ['title' => 'Review UI mockups for new feature', 'notes' => 'Provided feedback on user flow and visual hierarchy', 'time' => 50, 'status' => 'done'],
                ['title' => 'Review UX research findings', 'notes' => 'Analyzed user feedback and suggested design iterations', 'time' => 60, 'status' => 'done'],
                ['title' => 'Review accessibility compliance audit', 'notes' => 'Checked WCAG guidelines and screen reader compatibility', 'time' => 40, 'status' => 'done'],

                // Architecture Reviews
                ['title' => 'Review system architecture proposal', 'notes' => 'Evaluated scalability, maintainability, and security aspects', 'time' => 90, 'status' => 'done'],
                ['title' => 'Review API design specifications', 'notes' => 'Checked consistency, versioning, and documentation standards', 'time' => 55, 'status' => 'done'],
                ['title' => 'Review deployment pipeline changes', 'notes' => 'Validated CI/CD improvements and rollback strategies', 'time' => 45, 'status' => 'done'],

                // In Progress
                ['title' => 'Review performance optimization PR', 'notes' => 'Analyzing caching improvements and query optimizations', 'time' => 20, 'status' => 'in_progress'],

                // Scheduled
                ['title' => 'Review security audit findings', 'notes' => 'Analyze third-party security assessment results', 'time' => 0, 'status' => 'new'],
                ['title' => 'Review mobile app wireframes', 'notes' => 'Provide feedback on mobile user experience design', 'time' => 0, 'status' => 'new'],
            ]
        ]
    ];

    /**
     * Personal/Life contexts with activities
     */
    private array $personalContexts = [
        [
            'name' => 'Health',
            'icon' => '🏃',
            'activities' => [
                ['title' => 'Morning run in the park', 'notes' => '5K run, beautiful weather, feeling energized', 'time' => 45, 'status' => 'done'],
                ['title' => 'Gym workout - upper body', 'notes' => 'Focused on chest, shoulders, and triceps', 'time' => 60, 'status' => 'done'],
                ['title' => 'Yoga session for flexibility', 'notes' => 'Attended online Hatha yoga class', 'time' => 30, 'status' => 'done'],
                ['title' => 'Meal prep for the week', 'notes' => 'Prepared healthy lunches and snacks', 'time' => 90, 'status' => 'done'],
                ['title' => 'Meditation and mindfulness practice', 'notes' => '15 minutes of guided meditation', 'time' => 15, 'status' => 'done'],
                ['title' => 'Bike ride to work', 'notes' => 'Enjoyed cycling commute, good exercise', 'time' => 25, 'status' => 'done'],
                ['title' => 'Evening walk with spouse', 'notes' => 'Relaxing walk around the neighborhood', 'time' => 30, 'status' => 'done'],
                ['title' => 'Stretching after desk work', 'notes' => 'Important break from computer work', 'time' => 10, 'status' => 'done'],
                ['title' => 'Plan hiking trip for weekend', 'notes' => 'Research trails and pack gear', 'time' => 0, 'status' => 'new'],
                ['title' => 'Schedule annual health checkup', 'notes' => 'Book appointment with doctor', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Family',
            'icon' => '👨‍👩‍👧‍👦',
            'activities' => [
                ['title' => 'Help kids with homework', 'notes' => 'Assisted with math problems and reading', 'time' => 60, 'status' => 'done'],
                ['title' => 'Family dinner at home', 'notes' => 'Cooked pasta together, great family time', 'time' => 90, 'status' => 'done'],
                ['title' => 'Attend kids soccer game', 'notes' => 'Cheered from sidelines, kids played well', 'time' => 120, 'status' => 'done'],
                ['title' => 'Movie night with family', 'notes' => 'Watched animated film, made popcorn', 'time' => 120, 'status' => 'done'],
                ['title' => 'Weekend grocery shopping', 'notes' => 'Family trip to farmers market', 'time' => 75, 'status' => 'done'],
                ['title' => 'Read bedtime story to kids', 'notes' => 'Continued chapter book series', 'time' => 20, 'status' => 'done'],
                ['title' => 'Plan family vacation', 'notes' => 'Research destinations and activities', 'time' => 45, 'status' => 'in_progress'],
                ['title' => 'Organize family photos', 'notes' => 'Sort and backup digital photos', 'time' => 30, 'status' => 'in_progress'],
                ['title' => 'Visit grandparents this weekend', 'notes' => 'Plan visit and prepare gifts', 'time' => 0, 'status' => 'new'],
                ['title' => 'Kids school parent conference', 'notes' => 'Schedule meeting with teachers', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Personal Projects',
            'icon' => '🎯',
            'activities' => [
                ['title' => 'Work on side project portfolio', 'notes' => 'Updated personal website with recent projects', 'time' => 90, 'status' => 'done'],
                ['title' => 'Learn new programming language', 'notes' => 'Started Rust tutorial, completed basics', 'time' => 120, 'status' => 'done'],
                ['title' => 'Write technical blog post', 'notes' => 'Article about React best practices', 'time' => 150, 'status' => 'done'],
                ['title' => 'Contribute to open source project', 'notes' => 'Fixed bug in popular JavaScript library', 'time' => 180, 'status' => 'done'],
                ['title' => 'Build home automation system', 'notes' => 'Set up smart lights and sensors', 'time' => 240, 'status' => 'done'],
                ['title' => 'Create mobile app prototype', 'notes' => 'Built MVP for expense tracking app', 'time' => 300, 'status' => 'in_progress'],
                ['title' => 'Learn machine learning basics', 'notes' => 'Working through online course', 'time' => 60, 'status' => 'in_progress'],
                ['title' => 'Start podcast about tech', 'notes' => 'Research hosting platforms and equipment', 'time' => 0, 'status' => 'new'],
                ['title' => 'Write technical book chapter', 'notes' => 'Contributing to community tech book', 'time' => 0, 'status' => 'new'],
            ]
        ],
        [
            'name' => 'Hobbies',
            'icon' => '🎨',
            'activities' => [
                ['title' => 'Practice guitar playing', 'notes' => 'Learned new song, improved chord transitions', 'time' => 45, 'status' => 'done'],
                ['title' => 'Photography walk downtown', 'notes' => 'Captured street photography, tested new lens', 'time' => 120, 'status' => 'done'],
                ['title' => 'Cook new recipe for dinner', 'notes' => 'Tried Thai curry, turned out delicious', 'time' => 75, 'status' => 'done'],
                ['title' => 'Read fiction book', 'notes' => 'Finished sci-fi novel, very engaging story', 'time' => 90, 'status' => 'done'],
                ['title' => 'Work on puzzle project', 'notes' => '1000-piece landscape puzzle, making progress', 'time' => 60, 'status' => 'in_progress'],
                ['title' => 'Learn digital art techniques', 'notes' => 'Practicing with drawing tablet', 'time' => 45, 'status' => 'in_progress'],
                ['title' => 'Plan garden for spring', 'notes' => 'Research plants and layout design', 'time' => 0, 'status' => 'new'],
                ['title' => 'Join local chess club', 'notes' => 'Find club and schedule first visit', 'time' => 0, 'status' => 'new'],
            ]
        ]
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first two users (main test users)
        $users = User::limit(2)->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run the main DatabaseSeeder first.');
            return;
        }

        foreach ($users as $index => $user) {
            $this->command->info("Seeding activities for user: {$user->name}");

            // Clear existing activities and contexts for this user
            $user->activities()->delete();
            $user->contexts()->delete();
            $user->days()->delete();

            // Determine if this is a professional or personal user
            $isProfessional = $index === 0; // First user gets professional contexts
            $contexts = $isProfessional ? $this->professionalContexts : $this->personalContexts;

            // Create contexts for this user
            $userContexts = collect();
            foreach ($contexts as $contextData) {
                $context = Context::create([
                    'user_id' => $user->id,
                    'name' => $contextData['name'],
                    'icon' => $contextData['icon'],
                ]);
                $userContexts->put($context->name, $context);
            }

            // Generate activities for the past 30 days
            $startDate = Carbon::now()->subDays(29);

            for ($day = 0; $day < 30; $day++) {
                $currentDate = $startDate->copy()->addDays($day);
                $dateString = $currentDate->format('Y-m-d');

                // Generate 5-15 activities per day
                $dailyActivityCount = rand(5, 15);
                $dailyActivities = [];

                // Collect all possible activities
                $allActivities = collect();
                foreach ($contexts as $contextData) {
                    foreach ($contextData['activities'] as $activity) {
                        $allActivities->push([
                            'context_name' => $contextData['name'],
                            'activity' => $activity
                        ]);
                    }
                }

                // Select random activities for this day
                $selectedActivities = $allActivities->random($dailyActivityCount);

                foreach ($selectedActivities as $activityData) {
                    $context = $userContexts->get($activityData['context_name']);
                    $activity = $activityData['activity'];

                    // Add some variety to the activities
                    $title = $activity['title'];
                    $notes = $activity['notes'];
                    $time = $activity['time'];
                    $status = $activity['status'];

                    // Occasionally modify activities to add variety
                    if (rand(1, 100) <= 20) { // 20% chance
                        $title = $this->addVariety($title, $currentDate);
                    }

                    // Adjust time based on day (less time on weekends for work activities)
                    if ($currentDate->isWeekend() && str_contains($activityData['context_name'], 'Development')) {
                        $time = intval($time * 0.3); // Reduce work time on weekends
                    }

                    Activity::create([
                        'user_id' => $user->id,
                        'context_id' => $context->id,
                        'title' => $title,
                        'notes' => $notes,
                        'time' => $time,
                        'status' => $status,
                        'date' => $dateString,
                        'created_at' => $currentDate->copy()->addMinutes(rand(0, 1440)), // Random time during the day
                        'updated_at' => $currentDate->copy()->addMinutes(rand(0, 1440)),
                    ]);
                }

                // Occasionally add day notes (30% chance)
                if (rand(1, 100) <= 30) {
                    $dayNotes = $this->generateDayNotes($currentDate, $isProfessional);
                    Day::create([
                        'user_id' => $user->id,
                        'date' => $dateString,
                        'notes' => $dayNotes,
                        'created_at' => $currentDate,
                        'updated_at' => $currentDate,
                    ]);
                }
            }

            $this->command->info("Created {$user->activities()->count()} activities and {$user->days()->count()} day notes for {$user->name}");
        }
    }

    /**
     * Add variety to activity titles based on date
     */
    private function addVariety(string $title, Carbon $date): string
    {
        $variations = [
            'Implement' => ['Build', 'Create', 'Develop', 'Design'],
            'Fix' => ['Resolve', 'Debug', 'Troubleshoot', 'Address'],
            'Review' => ['Analyze', 'Evaluate', 'Assess', 'Examine'],
            'Write' => ['Create', 'Draft', 'Compose', 'Document'],
            'Plan' => ['Design', 'Strategize', 'Outline', 'Organize'],
            'Research' => ['Investigate', 'Explore', 'Study', 'Analyze'],
            'Meeting' => ['Discussion', 'Session', 'Call', 'Sync'],
            'Work on' => ['Continue', 'Progress on', 'Advance', 'Develop'],
        ];

        foreach ($variations as $original => $replacements) {
            if (str_contains($title, $original)) {
                $replacement = $replacements[array_rand($replacements)];
                $title = str_replace($original, $replacement, $title);
                break;
            }
        }

        // Add date-specific variations
        if ($date->isMonday()) {
            $title = "Monday: " . $title;
        } elseif ($date->isFriday()) {
            $title = str_replace('Plan', 'Wrap up', $title);
        }

        return $title;
    }

    /**
     * Generate realistic day notes
     */
    private function generateDayNotes(Carbon $date, bool $isProfessional): string
    {
        $professionalNotes = [
            "Productive day focusing on core development tasks. Made significant progress on the authentication refactor.",
            "Challenging debugging session today, but managed to resolve the memory leak issue that was affecting performance.",
            "Great collaboration with the design team. The new UI patterns are looking much more intuitive.",
            "Sprint planning went well. Team is aligned on priorities and feels confident about the upcoming deliverables.",
            "Spent most of the day in meetings, but they were valuable for stakeholder alignment and requirements clarification.",
            "Deep work day - managed to complete three major features without interruptions. Very satisfying progress.",
            "Code review day. Helped mentor junior developers and identified several opportunities for architectural improvements.",
            "Research and learning day. The new framework looks promising and could significantly improve our development velocity.",
            "Client demo went excellent. Stakeholders were impressed with the progress and provided positive feedback.",
            "Focused on technical debt today. Refactored legacy code and improved overall system maintainability."
        ];

        $personalNotes = [
            "Great family day! Kids were excited about their school projects and we had a wonderful dinner together.",
            "Managed to squeeze in a good workout and some reading time. Feeling balanced and energized.",
            "Productive day working on personal projects. Made progress on the mobile app prototype.",
            "Relaxing weekend day. Enjoyed cooking a new recipe and spending quality time at home.",
            "Busy day with errands and family commitments, but everything got done and we had fun.",
            "Beautiful weather for photography. Captured some great shots downtown and learned new techniques.",
            "Focused on health and wellness today. Morning run was refreshing and yoga session was exactly what I needed.",
            "Quality time with friends and family. Sometimes the best days are the simple ones.",
            "Creative day - worked on music, art, and personal writing projects. Feeling inspired.",
            "Mixed day of responsibilities and hobbies. Good balance between getting things done and personal enjoyment."
        ];

        $notes = $isProfessional ? $professionalNotes : $personalNotes;
        return $notes[array_rand($notes)];
    }
}