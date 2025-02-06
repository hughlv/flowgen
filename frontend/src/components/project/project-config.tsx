import { useProject } from '@/hooks';
import { ScrollArea } from '../ui/scroll-area';
import { GenericOption } from '../flow/option/option';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { toast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';
import { ProjectPublish } from './project-publish';
import { useState } from 'react';

export const ProjectConfig = ({ projectId }: { projectId: number }) => {
  const { project, updateProject } = useProject(projectId);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handleChange = (name: string, value: any) => {
    updateProject({ [name]: value }).catch(console.error);
  };

  const handleDownloadImage = () => {
    // Get the ReactFlow container element
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) {
      toast({
        title: 'Error',
        description: 'Could not find the flow canvas',
        variant: 'destructive',
      });
      return;
    }

    toPng(flowElement, {
      backgroundColor: '#ffffff00', // transparent background
      quality: 1,
      pixelRatio: 2,
    })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${project?.name || 'flow'}-canvas.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: 'Success',
          description: 'Canvas image downloaded successfully',
        });
      })
      .catch((error: Error) => {
        console.error('Failed to download canvas:', error);
        toast({
          title: 'Error',
          description: 'Failed to download canvas image',
          variant: 'destructive',
        });
      });
  };

  return (
    <ScrollArea className="h-full p-2">
      <div className="flex flex-col gap-4">
        <GenericOption
          nodeId={projectId.toString()}
          type="text"
          name="name"
          label="Name"
          data={{ name: project?.name }}
          onValueChange={handleChange}
        />
        <GenericOption
          nodeId={projectId.toString()}
          type="text"
          rows={5}
          name="description"
          label="Description"
          data={{ description: project?.description }}
          onValueChange={handleChange}
        />
        <Button
          onClick={() => setShowPublishDialog(true)}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Icons.share className="w-4 h-4" />
          Publish as Template
        </Button>
        <Button
          onClick={handleDownloadImage}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Icons.download className="w-4 h-4" />
          Download Canvas
        </Button>
        {showPublishDialog && (
          <ProjectPublish
            show={showPublishDialog}
            projectId={projectId}
            onClose={() => setShowPublishDialog(false)}
          />
        )}
      </div>
    </ScrollArea>
  );
};
