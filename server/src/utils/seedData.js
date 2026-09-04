import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Message } from '../models/Message.js';
import { Milestone } from '../models/Milestone.js';
import { ProjectFile } from '../models/ProjectFile.js';
import { Invitation } from '../models/Invitation.js';
import { Activity } from '../models/Activity.js';
import { Skill } from '../models/Skill.js';
import { findOptimalTeams } from '../services/matchingEngine.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping automatic seed.');
      return;
    }

    console.log('🌱 Seeding database with rich demo data...');

    // 1. Seed Skills Taxonomy
    const initialSkills = [
      { name: 'React', category: 'Frontend', popular: true, description: 'Declarative component-based UI library' },
      { name: 'Next.js', category: 'Frontend', popular: true, description: 'React framework for SSR and static web' },
      { name: 'Tailwind CSS', category: 'Frontend', popular: true, description: 'Utility-first CSS framework' },
      { name: 'TypeScript', category: 'Fullstack', popular: true, description: 'Typed superset of JavaScript' },
      { name: 'Node.js', category: 'Backend', popular: true, description: 'JavaScript runtime for backend services' },
      { name: 'Express.js', category: 'Backend', popular: true, description: 'Fast, minimalist web framework for Node' },
      { name: 'MongoDB', category: 'Backend', popular: true, description: 'NoSQL document database' },
      { name: 'PostgreSQL', category: 'Backend', popular: true, description: 'Advanced open-source relational database' },
      { name: 'Python', category: 'Backend', popular: true, description: 'Versatile language for backend, AI, and scripting' },
      { name: 'FastAPI', category: 'Backend', popular: false, description: 'Modern, high-performance web framework for Python' },
      { name: 'UI/UX Design', category: 'UI/UX Design', popular: true, description: 'User research, wireframing, usability design' },
      { name: 'Figma', category: 'UI/UX Design', popular: true, description: 'Collaborative interface design tool' },
      { name: 'Design Systems', category: 'UI/UX Design', popular: false, description: 'Reusable component libraries and style guides' },
      { name: 'Docker', category: 'DevOps & Cloud', popular: true, description: 'Containerization platform' },
      { name: 'Kubernetes', category: 'DevOps & Cloud', popular: true, description: 'Container orchestration' },
      { name: 'AWS', category: 'DevOps & Cloud', popular: true, description: 'Amazon Web Services cloud infrastructure' },
      { name: 'CI/CD Pipelines', category: 'DevOps & Cloud', popular: false, description: 'Automated integration and deployment' },
      { name: 'Flutter', category: 'Mobile', popular: true, description: 'Multi-platform mobile app development' },
      { name: 'React Native', category: 'Mobile', popular: true, description: 'Native mobile apps using React' },
      { name: 'GraphQL', category: 'Fullstack', popular: false, description: 'Query language for APIs' },
      { name: 'LangChain & OpenAI', category: 'Data & AI', popular: true, description: 'LLM application orchestration' },
      { name: 'PyTorch', category: 'Data & AI', popular: false, description: 'Deep learning framework' },
      { name: 'Cypress / Testing', category: 'QA & Testing', popular: false, description: 'End-to-end testing and QA automation' },
    ];

    await Skill.insertMany(initialSkills);

    // 2. Create Users
    // Clients
    const clientMark = await User.create({
      name: 'Mark Sterling',
      email: 'client@teambuilder.io',
      password: 'Password123!',
      role: 'client',
      title: 'Founder & CEO at Sterling Ventures',
      company: 'Sterling Global Tech',
      industry: 'E-Commerce & Food Tech',
      bio: 'Building modern consumer software products. Looking for high-velocity, synchronized engineering teams.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      totalProjectsCreated: 3
    });

    const clientRachel = await User.create({
      name: 'Dr. Rachel Adams',
      email: 'rachel@healthai.io',
      password: 'Password123!',
      role: 'client',
      title: 'Head of Product at Pulse Health AI',
      company: 'Pulse AI',
      industry: 'Digital Healthcare',
      bio: 'Pioneering generative AI clinical workflow solutions.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      totalProjectsCreated: 1
    });

    // Freelancers
    const freelancerAlex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@teambuilder.io',
      password: 'Password123!',
      role: 'freelancer',
      title: 'Senior Fullstack & System Architect',
      location: 'San Francisco, CA',
      bio: 'Specialized in scalable MERN applications, real-time WebSockets, and modern TypeScript architectures with 6+ years in production systems.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 65,
      experienceYears: 6,
      rating: 4.95,
      reviewsCount: 28,
      completedProjects: 24,
      availability: { hoursPerWeek: 40, status: 'available' },
      skills: [
        { skill: 'React', proficiency: 96, years: 6, category: 'Frontend' },
        { skill: 'Node.js', proficiency: 92, years: 6, category: 'Backend' },
        { skill: 'MongoDB', proficiency: 90, years: 5, category: 'Backend' },
        { skill: 'TypeScript', proficiency: 94, years: 4, category: 'Fullstack' },
        { skill: 'Next.js', proficiency: 88, years: 4, category: 'Frontend' },
        { skill: 'Tailwind CSS', proficiency: 92, years: 4, category: 'Frontend' },
        { skill: 'Docker', proficiency: 80, years: 3, category: 'DevOps & Cloud' }
      ],
      githubUrl: 'https://github.com/alexrivera-dev',
      githubStats: { publicRepos: 32, followers: 180, topLanguages: ['TypeScript', 'JavaScript', 'Go'] },
      portfolio: [
        {
          title: 'CloudScale SaaS Dashboard',
          description: 'High-throughput analytics dashboard processing 50k events/sec with React, Tailwind and Node.',
          link: 'https://github.com',
          tags: ['React', 'Node.js', 'Tailwind CSS', 'WebSockets']
        }
      ]
    });

    const freelancerSarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@teambuilder.io',
      password: 'Password123!',
      role: 'freelancer',
      title: 'Lead UI/UX & Design Systems Specialist',
      location: 'Seattle, WA',
      bio: 'Bridging design and code. Expert in Figma, interactive micro-animations, accessible design systems, and modern Tailwind CSS.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 55,
      experienceYears: 5,
      rating: 5.0,
      reviewsCount: 36,
      completedProjects: 31,
      availability: { hoursPerWeek: 35, status: 'available' },
      skills: [
        { skill: 'UI/UX Design', proficiency: 98, years: 5, category: 'UI/UX Design' },
        { skill: 'Figma', proficiency: 99, years: 5, category: 'UI/UX Design' },
        { skill: 'Design Systems', proficiency: 95, years: 4, category: 'UI/UX Design' },
        { skill: 'Tailwind CSS', proficiency: 90, years: 4, category: 'Frontend' },
        { skill: 'React', proficiency: 82, years: 3, category: 'Frontend' }
      ],
      githubUrl: 'https://github.com/sarahchen-design',
      githubStats: { publicRepos: 14, followers: 240, topLanguages: ['CSS', 'TypeScript'] },
      portfolio: [
        {
          title: 'Fintech Mobile & Web Design System',
          description: 'A complete multi-platform design token system with 120+ custom components and WCAG AAA compliance.',
          link: 'https://figma.com',
          tags: ['Figma', 'UI/UX Design', 'Design Systems']
        }
      ]
    });

    const freelancerMarcus = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@teambuilder.io',
      password: 'Password123!',
      role: 'freelancer',
      title: 'Senior Backend & DevOps Cloud Engineer',
      location: 'Austin, TX',
      bio: 'Cloud architectures, distributed microservices, database tuning, Docker/Kubernetes container orchestration, and high security APIs.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 70,
      experienceYears: 7,
      rating: 4.9,
      reviewsCount: 22,
      completedProjects: 20,
      availability: { hoursPerWeek: 40, status: 'available' },
      skills: [
        { skill: 'Node.js', proficiency: 95, years: 7, category: 'Backend' },
        { skill: 'PostgreSQL', proficiency: 94, years: 6, category: 'Backend' },
        { skill: 'MongoDB', proficiency: 92, years: 5, category: 'Backend' },
        { skill: 'Docker', proficiency: 94, years: 5, category: 'DevOps & Cloud' },
        { skill: 'AWS', proficiency: 90, years: 5, category: 'DevOps & Cloud' },
        { skill: 'Kubernetes', proficiency: 86, years: 4, category: 'DevOps & Cloud' },
        { skill: 'Python', proficiency: 88, years: 5, category: 'Backend' }
      ],
      githubUrl: 'https://github.com/marcusvance-cloud',
      githubStats: { publicRepos: 45, followers: 95, topLanguages: ['Go', 'JavaScript', 'Python'] }
    });

    const freelancerElena = await User.create({
      name: 'Elena Rostova',
      email: 'elena@teambuilder.io',
      password: 'Password123!',
      role: 'freelancer',
      title: 'Senior Frontend & React Specialist',
      location: 'New York, NY',
      bio: 'Creating pixel-perfect, hyper-responsive web experiences with React, Next.js, Framer Motion, and state-of-the-art tooling.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 48,
      experienceYears: 4,
      rating: 4.85,
      reviewsCount: 19,
      completedProjects: 17,
      availability: { hoursPerWeek: 40, status: 'available' },
      skills: [
        { skill: 'React', proficiency: 97, years: 4, category: 'Frontend' },
        { skill: 'Next.js', proficiency: 92, years: 3, category: 'Frontend' },
        { skill: 'Tailwind CSS', proficiency: 95, years: 4, category: 'Frontend' },
        { skill: 'TypeScript', proficiency: 88, years: 3, category: 'Fullstack' },
        { skill: 'GraphQL', proficiency: 84, years: 3, category: 'Fullstack' }
      ]
    });

    const freelancerDavid = await User.create({
      name: 'David Kim',
      email: 'david@teambuilder.io',
      password: 'Password123!',
      role: 'freelancer',
      title: 'AI/ML & Generative AI Engineer',
      location: 'Boston, MA',
      bio: 'Building LLM-powered applications, RAG pipelines, LangChain agents, vector database indexing, and Python backend APIs.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 75,
      experienceYears: 5,
      rating: 4.92,
      reviewsCount: 16,
      completedProjects: 14,
      availability: { hoursPerWeek: 30, status: 'available' },
      skills: [
        { skill: 'Python', proficiency: 97, years: 5, category: 'Backend' },
        { skill: 'LangChain & OpenAI', proficiency: 95, years: 2, category: 'Data & AI' },
        { skill: 'PyTorch', proficiency: 90, years: 4, category: 'Data & AI' },
        { skill: 'FastAPI', proficiency: 92, years: 3, category: 'Backend' },
        { skill: 'PostgreSQL', proficiency: 85, years: 4, category: 'Backend' }
      ]
    });

    const freelancerPriya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@teambuilder.io',
      password: 'Password123!',
      role: 'freelancer',
      title: 'Lead Mobile Engineer (Flutter & React Native)',
      location: 'Chicago, IL',
      bio: 'Cross-platform mobile architect with 10+ published apps on App Store and Google Play.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      hourlyRate: 52,
      experienceYears: 4,
      rating: 4.88,
      reviewsCount: 21,
      completedProjects: 19,
      availability: { hoursPerWeek: 40, status: 'available' },
      skills: [
        { skill: 'Flutter', proficiency: 95, years: 4, category: 'Mobile' },
        { skill: 'React Native', proficiency: 91, years: 4, category: 'Mobile' },
        { skill: 'TypeScript', proficiency: 86, years: 3, category: 'Fullstack' },
        { skill: 'Node.js', proficiency: 82, years: 3, category: 'Backend' }
      ]
    });

    // 3. Create Demo Projects
    // Project 1: Active Workspace project
    const projectQuickBite = await Project.create({
      title: 'QuickBite — Next-Gen Food Delivery & Real-Time Tracking Platform',
      description: 'A multi-vendor on-demand food delivery platform featuring client ordering web app, restaurant dashboard, courier geo-dispatch, and live real-time GPS tracking.',
      category: 'Fullstack Web Development',
      client: clientMark._id,
      budget: {
        total: 12000,
        currency: 'USD',
        type: 'fixed',
        hourlyLimit: 190
      },
      timeline: {
        durationWeeks: 6,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        targetDelivery: '6 weeks'
      },
      requiredSkills: [
        { skill: 'React', priority: 'high', minProficiency: 85, weight: 3.0 },
        { skill: 'Node.js', priority: 'high', minProficiency: 85, weight: 3.0 },
        { skill: 'UI/UX Design', priority: 'high', minProficiency: 80, weight: 3.0 },
        { skill: 'MongoDB', priority: 'medium', minProficiency: 75, weight: 2.0 },
        { skill: 'Docker', priority: 'medium', minProficiency: 70, weight: 2.0 },
        { skill: 'Tailwind CSS', priority: 'low', minProficiency: 70, weight: 1.0 }
      ],
      targetTeamSize: 3,
      status: 'active',
      progress: 60,
      repositoryUrl: 'https://github.com/sterling-tech/quickbite-platform',
      liveDemoUrl: 'https://quickbite-demo.teambuilder.io',
      teamMembers: [
        {
          user: freelancerAlex._id,
          roleInProject: 'Lead Fullstack Architect',
          hourlyRate: 65,
          status: 'accepted',
          joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          user: freelancerSarah._id,
          roleInProject: 'UI/UX & Design Systems Lead',
          hourlyRate: 55,
          status: 'accepted',
          joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          user: freelancerMarcus._id,
          roleInProject: 'Backend & Cloud DevOps Lead',
          hourlyRate: 70,
          status: 'accepted',
          joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        }
      ]
    });

    // Populate recommendations for QuickBite
    const allFreelancers = [freelancerAlex, freelancerSarah, freelancerMarcus, freelancerElena, freelancerDavid, freelancerPriya];
    projectQuickBite.recommendations = await findOptimalTeams(projectQuickBite, allFreelancers);
    await projectQuickBite.save();

    // 4. Create Tasks for QuickBite Workspace
    const task1 = await Task.create({
      project: projectQuickBite._id,
      title: 'Design System & Customer Journey Figma Mockups',
      description: 'Create high-fidelity Figma components, color palette, dark mode styles, and end-to-end checkout screens.',
      status: 'done',
      priority: 'high',
      assignedTo: freelancerSarah._id,
      createdBy: clientMark._id,
      estimatedHours: 24,
      subtasks: [
        { title: 'Color palette and typography system', completed: true },
        { title: 'Restaurant listing and menu layout', completed: true },
        { title: 'Checkout & Live tracking drawer', completed: true }
      ],
      order: 1
    });

    const task2 = await Task.create({
      project: projectQuickBite._id,
      title: 'Setup Monorepo & WebSocket Live Tracking Service',
      description: 'Configure Express + Socket.IO server with Redis pub/sub adapter for real-time driver coordinates broadcasting.',
      status: 'done',
      priority: 'urgent',
      assignedTo: freelancerMarcus._id,
      createdBy: clientMark._id,
      estimatedHours: 20,
      subtasks: [
        { title: 'Socket.IO handshake with JWT auth', completed: true },
        { title: 'Geospatial MongoDB index for restaurant proximity query', completed: true }
      ],
      order: 2
    });

    const task3 = await Task.create({
      project: projectQuickBite._id,
      title: 'Implement Interactive Food Cart & Checkout Flow',
      description: 'Build React components for multi-item cart, modifier options, promo codes, and Stripe Elements integration.',
      status: 'in_progress',
      priority: 'high',
      assignedTo: freelancerAlex._id,
      createdBy: clientMark._id,
      estimatedHours: 16,
      subtasks: [
        { title: 'Cart state persistence in local storage', completed: true },
        { title: 'Stripe PaymentIntent backend endpoint', completed: false }
      ],
      order: 3
    });

    const task4 = await Task.create({
      project: projectQuickBite._id,
      title: 'Courier Live GPS Map & ETA Calculator',
      description: 'Integrate Mapbox GL / Google Maps with smooth marker interpolation for real-time delivery tracking.',
      status: 'todo',
      priority: 'medium',
      assignedTo: freelancerAlex._id,
      createdBy: clientMark._id,
      estimatedHours: 14,
      order: 4
    });

    const task5 = await Task.create({
      project: projectQuickBite._id,
      title: 'Docker Compose & Production CI/CD Pipeline',
      description: 'Write Multi-stage Dockerfiles and GitHub Actions workflow for staging deployment.',
      status: 'backlog',
      priority: 'medium',
      assignedTo: freelancerMarcus._id,
      createdBy: clientMark._id,
      estimatedHours: 12,
      order: 5
    });

    // 5. Create Milestones for QuickBite
    await Milestone.create({
      project: projectQuickBite._id,
      title: 'Milestone 1: UX Architecture & Foundation',
      description: 'Approved Figma prototypes, database schema, and initial API repository setup.',
      amount: 4000,
      status: 'approved',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      submittedBy: freelancerSarah._id,
      submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      deliverableNote: 'Figma link and backend base repo pushed: https://figma.com/@quickbite-prototype',
      order: 1
    });

    await Milestone.create({
      project: projectQuickBite._id,
      title: 'Milestone 2: Ordering Flow & Real-Time Tracking Core',
      description: 'End-to-end cart checkout, payment processing, and WebSocket live courier updates.',
      amount: 5000,
      status: 'in_progress',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      order: 2
    });

    await Milestone.create({
      project: projectQuickBite._id,
      title: 'Milestone 3: Production Deployment & Final QA',
      description: 'Performance testing, responsive polish, automated testing suite, and launch.',
      amount: 3000,
      status: 'pending',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      order: 3
    });

    // 6. Create Messages in QuickBite Chat
    await Message.create({
      project: projectQuickBite._id,
      sender: clientMark._id,
      text: 'Welcome team! Thrilled to kick off the QuickBite build with Alex, Sarah, and Marcus. The matching engine put together a great squad.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    await Message.create({
      project: projectQuickBite._id,
      sender: freelancerSarah._id,
      text: 'Hey Mark! I have finalized the restaurant menu flows and design system tokens in Figma. Ready for frontend review!',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    });

    await Message.create({
      project: projectQuickBite._id,
      sender: freelancerAlex._id,
      text: 'Awesome work Sarah! I have connected the React cart components with Tailwind. The interaction feels super responsive.',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    });

    await Message.create({
      project: projectQuickBite._id,
      sender: freelancerMarcus._id,
      text: 'Socket.IO live location clustering is tested and ready. Looking forward to connecting the map frontend this week.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    // 7. Create Sample Project Files
    await ProjectFile.create({
      project: projectQuickBite._id,
      name: 'QuickBite_Architecture_Spec.pdf',
      originalName: 'QuickBite_Architecture_Spec.pdf',
      url: 'https://raw.githubusercontent.com/sample/spec.pdf',
      fileType: 'pdf',
      mimeType: 'application/pdf',
      size: 2450000,
      uploadedBy: clientMark._id,
      category: 'document'
    });

    await ProjectFile.create({
      project: projectQuickBite._id,
      name: 'design-tokens-export.json',
      originalName: 'design-tokens-export.json',
      url: 'https://raw.githubusercontent.com/sample/tokens.json',
      fileType: 'code',
      mimeType: 'application/json',
      size: 45000,
      uploadedBy: freelancerSarah._id,
      category: 'design'
    });

    // 8. Create Activity Feed Logs
    await Activity.create([
      {
        project: projectQuickBite._id,
        user: clientMark._id,
        action: 'project_created',
        details: 'Project QuickBite was created and funded'
      },
      {
        project: projectQuickBite._id,
        user: freelancerAlex._id,
        action: 'member_joined',
        details: 'Alex Rivera joined the team as Lead Fullstack Architect'
      },
      {
        project: projectQuickBite._id,
        user: freelancerSarah._id,
        action: 'milestone_approved',
        details: 'Milestone 1: UX Architecture & Foundation ($4,000) was approved'
      },
      {
        project: projectQuickBite._id,
        user: freelancerAlex._id,
        action: 'task_status_changed',
        details: 'Alex Rivera moved "Implement Interactive Food Cart" to In Progress'
      }
    ]);

    // 9. Create Project 2 (Matching/Draft Project for Instant Matching Demonstration)
    const projectAI = await Project.create({
      title: 'HealthPulse — AI Medical Assistant & Clinical Note Extractor',
      description: 'An intelligent clinician workstation that listens to patient audio consultations, extracts structured ICD-10 medical notes, and suggests diagnosis summaries using LLMs.',
      category: 'AI & Data Science',
      client: clientRachel._id,
      budget: {
        total: 18000,
        currency: 'USD',
        type: 'fixed',
        hourlyLimit: 220
      },
      timeline: {
        durationWeeks: 8,
        targetDelivery: '2 months'
      },
      requiredSkills: [
        { skill: 'Python', priority: 'high', minProficiency: 85, weight: 3.0 },
        { skill: 'LangChain & OpenAI', priority: 'high', minProficiency: 90, weight: 3.0 },
        { skill: 'React', priority: 'medium', minProficiency: 75, weight: 2.0 },
        { skill: 'PostgreSQL', priority: 'medium', minProficiency: 70, weight: 2.0 },
        { skill: 'UI/UX Design', priority: 'low', minProficiency: 65, weight: 1.0 }
      ],
      targetTeamSize: 3,
      status: 'matching'
    });

    projectAI.recommendations = await findOptimalTeams(projectAI, allFreelancers);
    await projectAI.save();

    console.log('✅ Database seeded successfully with demo data!');
  } catch (err) {
    console.error('❌ Database seeding error:', err);
  }
};
