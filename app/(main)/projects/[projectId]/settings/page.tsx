
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { StateManagement } from "@/features/states/components/state-management";
import { LabelManagement } from "@/features/labels/components/label-management";
import { CycleManagement } from "@/features/cycles/components/cycle-management";
import { ModuleManagement } from "@/features/modules/components/module-management";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectSettingsPage({
  params,
}: Props) {
  const { projectId } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Project Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your project configuration.
        </p>
      </div>

      <StateManagement key={`states-${projectId}`} />

      <LabelManagement key={`labels-${projectId}`} />

      <CycleManagement key={`cycles-${projectId}`} />

      <ModuleManagement key={`modules-${projectId}`} />
    </div>
  );
}
