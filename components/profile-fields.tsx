import type { Profile } from '@/lib/domain';
export function ProfileFields({ profile, prefix = '' }: { profile?: Profile; prefix?: string }) {
  return (
    <>
      <div className="form-grid">
        <label>
          Imię i nazwisko *
          <input
            name={`${prefix}name`}
            autoComplete="name"
            defaultValue={profile?.name}
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Email *
          <input
            name={`${prefix}email`}
            type="email"
            autoComplete="email"
            defaultValue={profile?.email}
            required
            maxLength={200}
          />
        </label>
        <label>
          Telefon *
          <input
            name={`${prefix}phone`}
            type="tel"
            autoComplete="tel"
            defaultValue={profile?.phone}
            required
            pattern={String.raw`[+0-9 \(\)\-]{7,25}`}
            maxLength={25}
          />
        </label>
        <label>
          Ulica i numer *
          <input
            name={`${prefix}street`}
            autoComplete="street-address"
            defaultValue={profile?.address.street}
            required
            minLength={3}
            maxLength={200}
          />
        </label>
        <label>
          Kod pocztowy *
          <input
            name={`${prefix}postalCode`}
            autoComplete="postal-code"
            defaultValue={profile?.address.postalCode}
            required
            pattern="[0-9]{2}-[0-9]{3}"
            placeholder="00-000"
          />
        </label>
        <label>
          Miejscowość *
          <input
            name={`${prefix}city`}
            autoComplete="address-level2"
            defaultValue={profile?.address.city}
            required
            minLength={2}
            maxLength={100}
          />
        </label>
      </div>
    </>
  );
}
export function readProfile(data: FormData, prefix = ''): Profile {
  const get = (name: string) => String(data.get(`${prefix}${name}`) ?? '');
  return {
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    address: { street: get('street'), postalCode: get('postalCode'), city: get('city') },
  };
}
