import { stateAbbreviations } from "~/lib/data";
import { Button, Checkbox, Input, Select, Textarea } from "../common";

export function NewClubForm() {
  return (
    <form className="space-y-4" method="post">
      <Input name="name" label="Name" placeholder="Yacht Club" required />
      <div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="city"
            label="City"
            description="Where is this club based out of?"
            placeholder="Bikertonfieldville"
            required
          />
          <Select name="state" label="State" required includeBlank>
            {stateAbbreviations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Textarea
        name="description"
        label="Description"
        placeholder="Don't forget about the rules..."
        required
      />
      <div>
        <Checkbox
          name="isPrivate"
          label="Make Private"
          required
          description="All clubs have to approve membership. Making a club private removes it
          from search results."
        />
      </div>
      <Button type="submit" className="w-full">
        Create
      </Button>
    </form>
  );
}
