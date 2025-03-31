"use client";

import { Table, Avatar, Text, Group, Card } from "@mantine/core";
import { validators } from "../utils/data";
import { formatPercent, formatCompactSimple } from "../utils/format";
export default function ValidatorTable() {
  return (
    <Card shadow="sm" p="md" radius="md" w="100%">
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Names</Table.Th>
            <Table.Th>Infra Rating</Table.Th>
            <Table.Th>7d τ APY</Table.Th>
            <Table.Th>Stake</Table.Th>
            <Table.Th>7d Yield</Table.Th>
            <Table.Th>Balance</Table.Th>
            <Table.Th>Fee</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {validators.map((validator, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar size="sm" radius="xl" color="dark">
                    {index + 1}
                  </Avatar>
                  <Text size="sm">{validator.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{formatPercent(validator.infra_rating)}</Table.Td>
              <Table.Td>{formatPercent(validator.tao_7d_apy)}</Table.Td>
              <Table.Td>
                <Text>{formatCompactSimple(validator.stake)}</Text>
                <Text size="xs" c="dimmed">
                  +80,396τ
                </Text>
              </Table.Td>
              <Table.Td>
                <Text>{formatCompactSimple(validator.yield_7d)}</Text>
                <Text size="xs" c="dimmed">
                  $474,371
                </Text>
              </Table.Td>
              <Table.Td>
                {/* <Text>{validator.balance}</Text> */}
                <Text size="xs" c="dimmed">
                  $530,000
                </Text>
              </Table.Td>
              <Table.Td>{formatPercent(validator.fee)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
