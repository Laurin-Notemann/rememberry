"use client";
import { RememberryCard } from "@frontend/components/authentication/RememberryCard";
import { Header } from "@frontend/components/layout/Header";
import { Button } from "@frontend/components/ui/button";
import { rqTrpc } from "@frontend/lib/services/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ConfirmUserProps = {
  params: { id: string };
};

export default function ConfirmUser({ params }: ConfirmUserProps) {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const confirmUser = rqTrpc.auth.confirm.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(rqTrpc.user.getUserBySession, undefined, "query"),
      });
    },
  });
  const router = useRouter();
  const confirmAccount = async () => {
    try {
      await confirmUser.mutateAsync(params.id);

      setTimeout(() => router.push("/"), 100);
    } catch (error) {
      if (error instanceof TRPCClientError) setError(error.message);
      else setError("Something went wrong");
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <RememberryCard title="Confirm your Account">
        <Button onClick={confirmAccount}>Confirm Account</Button>
        {error.length === 0 && <p className="text-error text-sm">{error}</p>}
      </RememberryCard>
    </div>
  );
}
