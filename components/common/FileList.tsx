"use client";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { UploadedItem } from "@/hooks/useFileUpload";
import { FileCard } from "./FileCard";

interface Props {
  items: UploadedItem[];
  disabled?: boolean;
  allowRotate?: boolean;
  onRemove: (id: string) => void;
  onRotate?: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export function FileList({ items, disabled, allowRotate, onRemove, onRotate, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const from = items.findIndex((i) => i.id === e.active.id);
    const to = items.findIndex((i) => i.id === e.over?.id);
    if (from >= 0 && to >= 0) onReorder(from, to);
  };

  if (items.length === 0) return null;
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} id="file-list">
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2" aria-label="Files, in the order they will be used">
          {items.map((item, index) => (
            <FileCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              disabled={disabled}
              allowRotate={allowRotate}
              onRemove={onRemove}
              onRotate={onRotate}
              onMove={onReorder}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
