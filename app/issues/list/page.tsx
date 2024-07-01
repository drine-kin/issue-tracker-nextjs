import prisma from "@/prisma/client";

import IssueActions from "./IssueActions";
import { Status } from "@prisma/client";
import Pagination from "@/app/components/Pagination";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
    searchParams: IssueQuery;
}

const IssuePage = async ({ searchParams }: Props) => {
    const statuses = Object.values(Status);

    const status = statuses.includes(searchParams.status)
        ? searchParams.status
        : undefined;

    const where = { status };

    const orderBy = columnNames.includes(searchParams.orderBy)
        ? { [searchParams.orderBy]: searchParams.sortOrder }
        : undefined;

    const page = parseInt(searchParams.page) || 1;
    const pageSize = parseInt(searchParams.pageSize) || 10;

    const issues = await prisma.issue.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
    });

    const issueCount = await prisma.issue.count({ where });

    return (
        <Flex direction="column" gap="6">
            <IssueActions />
            <IssueTable searchParams={searchParams} issues={issues} />
            <Pagination
                pageSize={pageSize}
                currentPage={page}
                itemCount={issueCount}
            />
        </Flex>
    );
};

export const dynamic = "force-dynamic";

export default IssuePage;

export const metadata: Metadata = {
    title: "Issue List - Issue Tracker",
    description: "View all project issues",
};
