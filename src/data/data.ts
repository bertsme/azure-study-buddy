import type { Card } from '../types'

export const CARDS: Card[] = [
  {
    id: 'c-shared-responsibility',
    topic: 'cloud-concepts',
    front: 'Shared responsibility model: in IaaS, who patches the guest OS?',
    back: 'You, the customer. Microsoft manages the physical hosts, network and datacenter. With PaaS, Microsoft also takes the OS. With SaaS, it manages almost everything except your data, accounts and access.',
  },
  {
    id: 'c-capex-opex',
    topic: 'cloud-concepts',
    front: 'CapEx vs OpEx: which one is cloud pay-as-you-go?',
    back: 'OpEx. You pay for what you use, like buying airtime by the bundle. CapEx is a large upfront spend on physical assets, like buying your own servers.',
  },
  {
    id: 'c-elasticity',
    topic: 'cloud-concepts',
    front: 'What is elasticity?',
    back: 'The ability to automatically scale resources out and in to match demand, such as extra capacity during a sale and less afterwards, so you only pay for what you need.',
  },
  {
    id: 'c-app-service',
    topic: 'architecture',
    front: 'Which Azure service hosts web apps without you managing servers or the OS?',
    back: 'Azure App Service, a PaaS offering. You deploy the app and the platform handles the servers and OS.',
  },
  {
    id: 'c-availability-zones',
    topic: 'architecture',
    front: 'What is an availability zone?',
    back: 'One or more physically separate datacenters within an Azure region, each with independent power, cooling and networking. They protect against datacenter-level failures.',
  },
  {
    id: 'c-blob-storage',
    topic: 'architecture',
    front: 'Which Azure storage is built for photos, videos and other unstructured data?',
    back: 'Blob Storage, Azure\'s object storage for massive amounts of unstructured data.',
  },
  {
    id: 'c-pricing-calculator',
    topic: 'management-governance',
    front: 'Pricing calculator vs TCO calculator?',
    back: 'Pricing calculator: estimates the monthly cost of the Azure services you pick. TCO calculator: compares the cost of running on-premises with running in Azure.',
  },
  {
    id: 'c-azure-policy',
    topic: 'management-governance',
    front: 'Azure Policy vs RBAC?',
    back: 'Azure Policy enforces rules on resources (e.g. allowed regions). RBAC controls who can do what. Policy is about what is allowed, RBAC is about who is allowed.',
  },
  {
    id: 'c-tags',
    topic: 'management-governance',
    front: 'What are Azure tags?',
    back: 'Name/value pairs (like department = sales) attached to resources to organise them and group costs for reporting.',
  },
  {
    id: 'c-iaas-paas-saas',
    topic: 'cloud-concepts',
    front: 'IaaS vs PaaS vs SaaS in one line each?',
    back: 'IaaS: you rent infrastructure like VMs and manage the OS and up. PaaS: you deploy apps and the platform manages the rest. SaaS: you just use finished software, like email.',
  },
  {
    id: 'c-resource-group',
    topic: 'architecture',
    front: 'What is a resource group?',
    back: 'A logical container that holds related Azure resources so you can manage, deploy and delete them together. Each resource belongs to exactly one resource group.',
  },
  {
    id: 'c-rbac',
    topic: 'management-governance',
    front: 'What does Azure RBAC do?',
    back: 'Role-based access control assigns roles (like Reader or Contributor) to users at a chosen scope, so people get only the access they need.',
  },
]