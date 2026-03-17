import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export interface AccionItem {
  icon: React.ReactNode
  label: string
  fn: () => void
  danger?: boolean
  separadorAntes?: boolean
}

interface Props {
  items: AccionItem[]
}

export function MenuAcciones({ items }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-7 h-7">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {items.map((item, i) => (
          <div key={item.label}>
            {item.separadorAntes && i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.fn}
              className={cn(
                'flex items-center gap-2.5 cursor-pointer',
                item.danger && 'text-destructive focus:text-destructive focus:bg-destructive/10'
              )}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}