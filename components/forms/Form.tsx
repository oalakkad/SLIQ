import { ChangeEvent, FormEvent, useMemo } from "react";
import { Input } from "@/components/forms";
import { Button, Spinner } from "@chakra-ui/react";

interface Config {
  labelText: string;
  labelId: string;
  type: string;
  value: string;
  link?: {
    linkText: string;
    linkUrl: string;
  };
  required?: boolean;
}

interface Props {
  config: Config[];
  isLoading: boolean;
  btnText: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function Form({
  config,
  isLoading,
  btnText,
  onChange,
  onSubmit,
}: Props) {
  // ✅ Compute if any password / re_password pair mismatches
  const hasPasswordMismatch = useMemo(() => {
    // build maps for base password fields and their re_ counterparts
    const pwdMap = new Map<string, string>(); // e.g. "password" -> "hunter2"
    const repwdMap = new Map<string, string>(); // e.g. "password" -> "hunter3"

    for (const field of config) {
      if (field.type !== "password") continue;
      const id = field.labelId || "";
      if (id.startsWith("re_")) {
        const base = id.replace(/^re_/, "");
        repwdMap.set(base, field.value ?? "");
      } else {
        pwdMap.set(id, field.value ?? "");
      }
    }

    // compare pairs where both exist
    for (const [base, pwdVal] of pwdMap) {
      if (repwdMap.has(base)) {
        const reVal = repwdMap.get(base) ?? "";
        // Only flag mismatch when both have some value
        if (pwdVal.length > 0 && reVal.length > 0 && pwdVal !== reVal) {
          return true;
        }
      }
    }
    return false;
  }, [config]);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {config.map((input) => (
        <Input
          key={input.labelId}
          labelId={input.labelId}
          type={input.type}
          onChange={onChange}
          value={input.value}
          link={input.link}
          required={input.required}
        >
          {input.labelText}
        </Input>
      ))}

      {/* Inline validation message */}
      {hasPasswordMismatch && (
        <p className="text-sm text-red-600">Passwords do not match</p>
      )}

      <div>
        <Button
          variant={"solidPink"}
          fontFamily={'"Readex Pro", sans-serif'}
          py={7}
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoading || hasPasswordMismatch}
        >
          {isLoading ? <Spinner color="brand.pink" size="xl" /> : `${btnText}`}
        </Button>
      </div>
    </form>
  );
}
