import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type Payment = {
  date: string
  company: string
  amount: string
}

export default function PaymentTable({ payments }: { payments: Payment[] }) {
  return (
    <Table className="bg-white rounded-xl overflow-hidden border">
      <TableHeader>
        <TableRow>
          <TableHead>DATE</TableHead>
          <TableHead>COMPANY</TableHead>
          <TableHead className="text-right">AMOUNT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p, i) => (
          <TableRow key={i} className="border-t">
            <TableCell>{p.date}</TableCell>
            <TableCell>{p.company}</TableCell>
            <TableCell className="text-right font-medium">{p.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
