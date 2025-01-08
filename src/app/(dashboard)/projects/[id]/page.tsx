import { cookies } from 'next/headers';
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Meta } from "@/components/seo/Meta";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  console.log("\n=== Project Page Start ===")
  const resolvedParams = await params; // Resolve params as a Promise
  console.log("🎯 Project ID:", resolvedParams.id)
  
  // Get token from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value || 
                cookieStore.get('Authorization')?.value?.replace('Bearer ', '')

  if (!token) {
    console.log("❌ No token found, redirecting to login")
    redirect('/auth/login')
  }

  const verified = await verifyJwt(token)
  if (!verified) {
    console.log("❌ Invalid token, redirecting to login")
    redirect('/auth/login')
  }

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: {
      owner: true,
      members: true,
      tasks: true,
    },
  });

  if (!project) {
    console.log("❌ Project not found")
    notFound();
  }

  // Check if user has access to the project
  const hasAccess = project.owner.id === verified.id || project.members.some(member => member.id === verified.id);
  console.log("🔒 Access check:", {
    hasAccess,
    isOwner: project.owner.id === verified.id,
    isMember: project.members.some(member => member.id === verified.id),
    userId: verified.id,
    ownerId: project.owner.id,
    memberIds: project.members.map(m => m.id)
  })
  
  if (!hasAccess) {
    console.log("❌ Access denied, redirecting to dashboard")
    redirect('/dashboard');
  }

  console.log("✅ Access granted to project:", project.name)
  console.log("=== Project Page End ===\n")

  const completedTasks = project.tasks.filter((task) => task.status === 'COMPLETED').length;
  const progress =
    project.tasks.length > 0
      ? Math.round((completedTasks / project.tasks.length) * 100)
      : 0;

  return (
    <>
      <Meta
        title={project.name}
        description={project.description || `Collaborate and manage tasks for ${project.name}`}
        keywords={`${project.name}, project management, tasks, collaboration`}
      />
      <div className="flex items-center gap-6 flex-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {project.name}
            </h1>
            <Badge
              variant="secondary"
              className="bg-[#40534C]/10 text-[#40534C] hover:bg-[#40534C]/20"
            >
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-6 w-6 border-2 border-background ring-0"
                  >
                    <AvatarFallback className="text-xs bg-[#677D6A]/10 text-[#677D6A]">
                      {member.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {project.members.length > 3 && (
                <span className="text-sm text-muted-foreground">
                  +{project.members.length - 3}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-32 flex items-center gap-2">
                <Progress value={progress} className="h-1.5" />
                <span className="text-xs tabular-nums">{progress}%</span>
              </div>
              <span>•</span>
              <span>{project.tasks.length} tasks</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
