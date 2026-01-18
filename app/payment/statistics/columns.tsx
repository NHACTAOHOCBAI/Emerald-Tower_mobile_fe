import { TableColumn } from "@/components/ui/Table";
import { StatisticsItem } from "@/types/payment";
import { Text } from "react-native";

const statisticsColumns: TableColumn<StatisticsItem>[] = [
  {
    header: "THÁNG",
    width: "w-[18%]",
    align: "center",
    accessor: (item) => (
      <Text className="text-[11px] font-medium text-black">{item.month}</Text>
    ),
  },
  {
    header: "ĐIỆN",
    align: "center",
    accessor: (item) => <Text className="text-[11px] text-black">{item.elec}</Text>,
  },
  {
    header: "NƯỚC",
    align: "center",
    accessor: (item) => <Text className="text-[11px] text-black">{item.water}</Text>,
  },
  {
    header: "PHÍ QL",
    align: "center",
    accessor: (item) => <Text className="text-[11px] text-black">{item.service}</Text>,
  },
  {
    header: "TỔNG",
    width: "w-[22%]",
    align: "center",
    accessor: (item) => (
      <Text className="text-[11px] font-bold text-main">{item.total}</Text>
    ),
  },
];

export default statisticsColumns;
