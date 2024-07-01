"use client";

import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { Skeleton } from "@/app/components";
import { useRouter } from "next/navigation";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
    const { data: users, error, isLoading } = useUsers();

    const router = useRouter();

    if (isLoading) return <Skeleton />;

    if (error) return null;

    const assignIssue = (userId: string) => {

        axios
            .patch("/api/issues/" + issue.id, {
                assignedToUserId: userId === "Unassigned" ? null : userId,
                status: userId === "Unassigned" ? "OPEN" : "IN_PROGRESS",
            })
            .then(() => {
                router.refresh();
            })
            .catch((e) => {
                console.error("error ", e);
                toast.error("Changes could not be saved.");
            });
    };

    return (
        <>
            <Select.Root
                defaultValue={issue.assignedToUserId || "Unassigned"}
                onValueChange={assignIssue}
            >
                <Select.Trigger placeholder="Assign..." />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Suggestions</Select.Label>
                        <Select.Item value="Unassigned">Unassigned</Select.Item>
                        {users?.map((user) => (
                            <Select.Item key={user.id} value={user.id}>
                                {user.name}
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Toaster />
        </>
    );
};

const useUsers = () =>
    useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => axios.get("/api/users").then((res) => res.data),
        staleTime: 60 * 1000, //60s
        retry: 3,
    });

export default AssigneeSelect;
