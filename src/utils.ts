import { Category, categories } from './types';

export function isOverdue(dueDate?: string, done?: boolean): boolean {
  if (!dueDate || done) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function categoryLabel(value?: string): string {
  if (!value) return '';
  const labels: string[] = [];
  let level: Category[] | undefined = categories;
  for (const part of value.split('/').map((_, i, parts) => parts.slice(0, i + 1).join('/'))) {
    const node: Category | undefined = level?.find((c) => c.value === part);
    if (!node) break;
    labels.push(node.label);
    level = node.children;
  }
  return labels.join(' / ');
}

export function flattenCategories(
  nodes: Category[] = categories,
  depth = 0,
): { value: string; label: string; depth: number }[] {
  return nodes.flatMap((node) => [
    { value: node.value, label: node.label, depth },
    ...flattenCategories(node.children ?? [], depth + 1),
  ]);
}

export function getBaseUrl(): string {
  if (typeof document === 'undefined') return '';
  const base = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';
  return base.replace(/[/]$/, '');
}
