import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Dialog } from "@/components/ui/dialog";
import { getLeadFormComponentForPath } from "@/forms/lead/registry";

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadFormDialog = ({ isOpen, onClose }: LeadFormDialogProps) => {
  const location = useLocation();
  const LeadFormContent = useMemo(() => {
    return getLeadFormComponentForPath(location.pathname);
  }, [location.pathname]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <LeadFormContent isOpen={isOpen} onClose={onClose} />
    </Dialog>
  );
};
