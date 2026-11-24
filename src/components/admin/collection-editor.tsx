import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ActionState } from "@/lib/validation";
import { RecordForm, type FieldDef } from "./record-form";
import { DeleteButton } from "./delete-button";

type Item = { id: string } & Record<string, unknown>;

/**
 * One editable card per record, plus an "Add" card.
 * `save` and `remove` are server actions; they're bound to each id here on the server.
 */
export function CollectionEditor<T extends Item>({
  items,
  fields,
  toDefaults,
  title,
  save,
  remove,
  noun,
}: {
  items: T[];
  fields: FieldDef[];
  toDefaults: (item: T) => Record<string, string | number | boolean | null>;
  title: (item: T) => string;
  save: (id: string | null, prev: ActionState, fd: FormData) => Promise<ActionState>;
  remove: (id: string) => Promise<void>;
  noun: string;
}) {
  const nextOrder = items.length ? Math.max(...items.map((i) => Number(i.order ?? 0))) + 1 : 0;
  return (
    <div className="flex flex-col gap-s4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{title(item)}</CardTitle>
          </CardHeader>
          <RecordForm
            fields={fields}
            defaults={toDefaults(item)}
            action={save.bind(null, item.id)}
            footer={
              <span className="ml-auto">
                <DeleteButton action={remove.bind(null, item.id)} confirmText={`Delete this ${noun}? This can't be undone.`} />
              </span>
            }
          />
        </Card>
      ))}
      <Card className="border-dashed border-brand/60">
        <CardHeader>
          <CardTitle>Add {noun}</CardTitle>
          <CardDescription>Lower order numbers appear first.</CardDescription>
        </CardHeader>
        <RecordForm fields={fields} defaults={{ order: nextOrder }} action={save.bind(null, null)} submitLabel={`Add ${noun}`} resetOnSuccess />
      </Card>
    </div>
  );
}
