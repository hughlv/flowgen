'use client';

import { CopyButton } from '@/components/copy-button';
import { DeleteButton } from '@/components/delete-button';
import { DashboardHeader } from '@/components/header';
import { Icons } from '@/components/icons';
import { DashboardShell } from '@/components/shell';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const ApiKeyText = ({ apikey }: { apikey: string }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (isShowing) {
      setText(apikey);
    } else {
      setText(
        apikey.slice(0, 6) + '*'.repeat(apikey.length - 10) + apikey.slice(-4)
      );
    }
  }, [apikey, isShowing]);
  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          'mr-2 break-all px-4 py-2 rounded-xl bg-base-100 cursor-pointer'
        )}
        onClick={() => setIsShowing(!isShowing)}
      >
        {text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsShowing(!isShowing)}
      >
        {isShowing ? (
          <Icons.eyeOff className="w-4 h-4 text-yellow-600" />
        ) : (
          <Icons.eye className="w-4 h-4 text-green-600" />
        )}
      </Button>
      <CopyButton content={apikey} />
    </div>
  );
};

const CreateKeyDialog = ({ show, setShow }: any) => {
  const [name, setName] = useState('Default Name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: any) => {
    e.prevenTableCellefault();
    setLoading(true);
    fetch('/api/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, key: '<to_be_generated>' }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((resp) => resp.json())
      .then((json) => {
        setShow(true);
      })
      .catch((e) => {
        console.error(e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button>Create API Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create API Key</DialogTitle>
        <DialogDescription>
          Create a new API key to use in your projects.
        </DialogDescription>
        <form className="flex flex-col gap-3 w-full" onSubmit={onSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-primary input-bordered"
          />
          <Button
            type="submit"
            className={clsx('btn btn-primary', {
              'btn-disabled btn-outline': loading || !name,
            })}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-sm" />
                Creating API Key...
              </div>
            ) : (
              'Create API Key'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<any[]>([]);
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    await fetch('/api/api-keys', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          toast({
            title: 'Error',
            description: json.error,
            variant: 'destructive',
          });
          throw new Error(json.error);
        }
        setKeys(json);
      })
      .catch((e) => {
        console.error(JSON.stringify(e));
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchKeys();
  }, []);

  const onDeleteKey = async (key: any) => {
    await fetch(`/api/api-keys/${key.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(() => {
        toast({
          title: 'Delete API Key',
          description: `Successfully deleted API key "${key.name}"`,
        });
        setKeys(keys.filter((k) => k.id !== key.id));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (loading) {
    return (
      <div className="relative flex flex-col w-full h-full items-center justify-center gap-2">
        <div className="loading text-primary loading-infinity"></div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between w-full gap-2 py-2">
        <DashboardHeader heading="API Keys" text="Manage your API keys" />
        <CreateKeyDialog
          show={showCreateKeyDialog}
          setShow={setShowCreateKeyDialog}
        />
      </div>
      <Table className="border-transparent rounded-lg bg-base-content/20">
        <TableHeader>
          <TableRow className="flex w-full font-bold">
            <TableCell className="w-12 lg:w-32">Name</TableCell>
            <TableCell className="flex flex-grow lg:min-w-80">Key</TableCell>
            <TableCell className="w-40 hidden lg:flex">Created</TableCell>
            <TableCell className="items-center justify-center gap-2 w-28 hidden lg:flex">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2">
          {keys.map((key) => {
            return (
              <TableRow key={key.id} className="flex items-center w-full py-2">
                <TableCell className="w-12 lg:w-32">
                  {key.name || '(No name)'}
                </TableCell>
                <TableCell className="flex flex-grow lg:min-w-80">
                  <ApiKeyText apikey={key.key} />
                </TableCell>
                <TableCell className="hidden lg:flex">
                  {new Date(key.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="items-center justify-center gap-2 w-28 hidden lg:flex">
                  <DeleteButton
                    tooltip="Delete API Key"
                    onDelete={() => onDeleteKey(key)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </DashboardShell>
  );
};

export default Page;
