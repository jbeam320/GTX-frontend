"use client";
import React, { useEffect, useState } from "react";
import { Subnet } from "../utils/types";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  Card,
  Button,
  TextInput,
  Group,
  Table,
  Avatar,
  Loader,
  Center,
} from "@mantine/core";
import { formatCompact, formatPercent, formatPrice } from "../utils/format";
import { useSubnet } from "../hooks";
import {
  subnets,
  taoPrice,
  loading_subnets,
  loading_taoPrice,
} from "../utils/data";

export default function SubnetPage() {
  // const { subnets, taoPrice, loading_subnets, loading_taoPrice } = useWallet();

  const [filtered, setFiltered] = useState<Subnet[]>([]);
  const [search, setSearch] = useState("");
  const [isUSD, setIsUSD] = useState(false);

  const columns: (keyof Subnet)[] = Object.keys(
    subnets?.[0] || {}
  ) as (keyof Subnet)[];

  // Filter subnets based on search term
  useEffect(() => {
    if (!search) return setFiltered(subnets);
    setFiltered(
      subnets.filter((s: Subnet) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, subnets]);

  return (
    <div className="p-6">
      {/* Search and Currency Switch */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="w-full sm:w-80 relative">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a subnet"
            leftSection={<i className="fas fa-search" />}
            styles={{
              input: {
                backgroundColor: "#f4f4f5",
                border: "none",
                borderRadius: "8px",
              },
            }}
          />
        </div>
        <Group>
          <Button.Group>
            <Button
              variant={!isUSD ? "filled" : "default"}
              onClick={() => setIsUSD(false)}
              radius="xl"
              style={{ backgroundColor: !isUSD ? "#000" : "transparent" }}
            >
              TAO
            </Button>
            <Button
              variant={isUSD ? "filled" : "default"}
              onClick={() => setIsUSD(true)}
              radius="xl"
              style={{ backgroundColor: isUSD ? "#000" : "transparent" }}
            >
              USD
            </Button>
          </Button.Group>
        </Group>
      </div>

      {/* Table with Data */}
      <Card shadow="sm" p={0}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column}>{column}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {loading_subnets || loading_taoPrice ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Center>
                    <Loader />
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered?.map((s, i) => (
                <Table.Tr key={s.netuid}>
                  <Table.Td>{i}</Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size="sm" radius="xl" color="dark">
                        {s.netuid}
                      </Avatar>
                      <div>
                        <div>{s.name}</div>
                        <div className="text-xs text-gray-500">{s.netuid}</div>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>{formatPercent(s.emission / 1e9)}</Table.Td>
                  <Table.Td>
                    {formatPrice(s.price, isUSD ? taoPrice.price : null)}
                  </Table.Td>
                  {[
                    "price_change_1h",
                    "price_change_24h",
                    "price_change_1w",
                  ].map((column) => (
                    <Table.Td key={column}>
                      <Button
                        variant="light"
                        color={
                          s.price_change_1h >= 0
                            ? "var(--green-stroke)"
                            : "var(--red-stroke)"
                        }
                        radius="xl"
                        size="xs"
                      >
                        {formatPercent(s[column as keyof Subnet] as number)}
                      </Button>
                    </Table.Td>
                  ))}
                  <Table.Td>
                    {formatCompact(s.market_cap, isUSD ? taoPrice.price : null)}
                  </Table.Td>
                  <Table.Td>
                    {formatCompact(
                      s.liquidity || 0,
                      isUSD ? taoPrice.price : null
                    )}
                  </Table.Td>
                  <Table.Td>
                    {formatCompact(s.volume_24h, isUSD ? taoPrice.price : null)}
                  </Table.Td>
                  <Table.Td style={{ width: 100, height: 40 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={s.last_7days_trends.map((value, index) => ({
                          date: `Day ${index + 1}`,
                          value,
                        }))}
                      >
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={
                            s.last_7days_trends[
                              s.last_7days_trends.length - 1
                            ] >= s.last_7days_trends[0]
                              ? "var(--green-stroke)"
                              : "var(--red-stroke)"
                          }
                          fill={
                            s.last_7days_trends[
                              s.last_7days_trends.length - 1
                            ] >= s.last_7days_trends[0]
                              ? "var(--green-fill)"
                              : "var(--red-fill)"
                          }
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
