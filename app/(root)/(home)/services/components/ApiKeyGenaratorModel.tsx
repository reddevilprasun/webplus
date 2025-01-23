import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegenerateApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RegenerateApiKeyDialog({
  isOpen,
  onClose,
  onConfirm,
}: RegenerateApiKeyDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            Regenerate API Key
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to regenerate your API key? This action cannot be undone.
        </DialogDescription>
        <DialogFooter className="sm:justify-start">
          <Button variant="destructive" onClick={handleConfirm}>
            Yes, Regenerate Key
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
