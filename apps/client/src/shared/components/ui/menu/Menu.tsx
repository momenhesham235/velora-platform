import { type ReactNode } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  type DropdownProps,
  type DropdownMenuProps,
} from '@heroui/react';

/**
 * Velora Menu — facade over HeroUI Dropdown.
 *
 * Usage:
 *   <Menu>
 *     <Menu.Trigger><button>...</button></Menu.Trigger>
 *     <Menu.Content aria-label="Account menu">
 *       <Menu.Item key="settings" onPress={...}>Settings</Menu.Item>
 *       <Menu.Item key="logout" color="danger" onPress={...}>Sign out</Menu.Item>
 *     </Menu.Content>
 *   </Menu>
 *
 * Note on Item/Section:
 *   HeroUI uses react-aria's Collection mechanism, which requires
 *   DropdownItem / DropdownSection to be DIRECT children of DropdownMenu.
 *   Wrapping them breaks the collection (items disappear at runtime).
 *   So Menu.Item / Menu.Section are direct re-exports — naming is sanitized,
 *   the prop API stays HeroUI's. `key` is required per item.
 */

export interface MenuProps extends Omit<DropdownProps, 'children'> {
  children: ReactNode;
}

function MenuRoot({ children, placement = 'bottom-end', ...rest }: MenuProps) {
  return (
    <Dropdown placement={placement} {...rest}>
      {children as DropdownProps['children']}
    </Dropdown>
  );
}

function MenuTrigger({ children }: { children: ReactNode }) {
  return <DropdownTrigger>{children}</DropdownTrigger>;
}

export interface MenuContentProps
  extends Omit<DropdownMenuProps, 'classNames'> {
  /** Forwarded for screen readers — required by react-aria. */
  'aria-label': string;
}

function MenuContent({ children, ...rest }: MenuContentProps) {
  return (
    <DropdownMenu
      {...rest}
      classNames={{
        base: 'bg-content1 border border-divider rounded-xl p-1 min-w-[220px] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.75)]',
        list: 'gap-0.5',
      }}
    >
      {children}
    </DropdownMenu>
  );
}

/**
 * Compound API. `Item` / `Section` are direct HeroUI re-exports for
 * react-aria collection compatibility — see comment at top of file.
 */
export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: DropdownItem,
  Section: DropdownSection,
});
