'use client';
import { Loading } from '@/components/loader';
import { Settings, useSettings, LlmModel } from '@/hooks/use-settings';
import { genId } from '@/lib/id';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { Collapsible } from '@/components/ui/collapsible';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';

const ModelForm = ({ model: sourceModel, onSave }: any) => {
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiType, setApiType] = useState('');
  const [apiVersion, setApiVersion] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tags, setTags] = useState('');

  useEffect(() => {
    setModel(sourceModel.model);
    setDescription(sourceModel.description);
    setApiKey(sourceModel.api_key);
    setBaseUrl(sourceModel.base_url);
    setApiType(sourceModel.api_type);
    setApiVersion(sourceModel.api_version);
    setTags(sourceModel.tags);
  }, [sourceModel]);

  const debouncedSave = useDebounce((updatedData: any) => {
    onSave({
      ...sourceModel,
      ...updatedData,
    });
  }, 500);

  const handleFieldChange = (field: string, value: string) => {
    const setters: any = {
      model: setModel,
      description: setDescription,
      api_key: setApiKey,
      base_url: setBaseUrl,
      api_type: setApiType,
      api_version: setApiVersion,
      tags: setTags,
    };
    setters[field](value);
    debouncedSave({ [field]: value });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span>Model Name</span>
          <Input
            value={model || ''}
            onChange={(e) => handleFieldChange('model', e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>API Key</span>
          <Input
            value={apiKey || ''}
            onChange={(e) => handleFieldChange('api_key', e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span>Description</span>
          <Textarea
            value={description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
        </label>
      </div>
      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2 py-2">
            <span>Show Advanced Options</span>
            <Icons.chevronsUpDown className="w-4 h-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-2 gap-4 w-full">
          <label className="flex flex-col gap-1 w-full">
            <span>Base URL</span>
            <Input
              value={baseUrl || ''}
              onChange={(e) => handleFieldChange('base_url', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>API Type (e.g., azure)</span>
            <Input
              value={apiType || ''}
              onChange={(e) => handleFieldChange('api_type', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>API Version</span>
            <Input
              value={apiVersion || ''}
              onChange={(e) => handleFieldChange('api_version', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Tags (Use comma as separater)</span>
            <Input
              value={tags || ''}
              onChange={(e) => handleFieldChange('tags', e.target.value)}
            />
          </label>
        </CollapsibleContent>
      </Collapsible>{' '}
    </div>
  );
};

const ModelCard = ({ model, onSave, onDelete }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(model.id);
    setIsDeleting(false);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <Icons.brain className="w-5 h-5" />
            <h1 className="font-bold">Model: {model.model}</h1>
          </div>
          <div>
            <Button
              className="flex items-center gap-2 text-red-300 hover:text-red-500"
              variant="ghost"
              onClick={handleDelete}
            >
              {isDeleting && <Icons.spinner className="animate-spin size-4" />}
              {!isDeleting && <Icons.trash className="w-4 h-4" />}
              Delete
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ModelForm model={model} onSave={onSave} />
      </CardContent>
    </Card>
  );
};

const Page = () => {
  const { settings, isLoading, isError, updateSettings } = useSettings();
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error loading settings</div>;
  }

  const onAddModel = async () => {
    setIsCreating(true);
    await updateSettings({
      ...settings,
      models: [
        ...(settings?.models || []),
        {
          id: `llm-${genId()}`,
          model: 'llm-model1',
          description: 'New Model Description',
          api_key: '',
        },
      ],
    });
    setIsCreating(false);
  };

  const handleSaveModel = async (updatedModel: LlmModel) => {
    const newModels = settings?.models?.map((m) =>
      m.id === updatedModel.id ? updatedModel : m
    );
    await updateSettings({
      ...settings,
      models: newModels,
    });
  };

  const handleDeleteModel = async (modelId: string) => {
    const newModels = settings?.models?.filter((m) => m.id !== modelId);
    await updateSettings({
      ...settings,
      models: newModels,
    });
  };

  return (
    <ScrollArea className="relative flex flex-col w-full gap-2 text-sm p-4">
      <div className="flex items-end justify-between mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold">Models</h1>
          <div>
            Manage the LLM model configurations. The models configured here will
            be shared by all projects.
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-2">
          <Button className="flex items-center gap-2" onClick={onAddModel}>
            {!isCreating && <Icons.add className="w-4 h-4" />}
            {isCreating && <Icons.spinner className="w-4 h-4 animate-spin" />}
            New Model
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {settings ? (
          settings.models?.map((model) => (
            <ModelCard
              model={model}
              key={model.id}
              onSave={handleSaveModel}
              onDelete={handleDeleteModel}
            />
          ))
        ) : (
          <div>No models found</div>
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
