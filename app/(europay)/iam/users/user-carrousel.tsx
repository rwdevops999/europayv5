"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiSolidUserDetail } from "react-icons/bi";
import { CiAt } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiScrollUnfurled } from "react-icons/gi";
import { MdPolicy } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { columnsPolicies } from "./table/colums-policies";
import { columnsRoles } from "./table/colums-roles";
import { columnsGroups } from "./table/colums-groups";
import { DataTableToolbar } from "./table/page-data-table-toolbar";
import {
  tCountry,
  tGroup,
  tPolicy,
  tRole,
  tUser,
  tUserCreate,
  tUserUpdate,
} from "@/lib/prisma-types";
import { useUser } from "@/hooks/use-user";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { Data, ToastType } from "@/lib/types";
import { mapGroups, mapPolicies, mapRoles } from "@/app/client/mapping";
import { DEFAULT_COUNTRY } from "@/lib/constants";
import AvatarSelect from "@/ui/avatar-select";
import CountrySelect from "@/ui/country-select";
import { DataTable } from "@/ui/datatable/data-table";
import { createUser, loadUserById, updateUser } from "@/app/server/users";
import { absoluteUrl, showToast } from "@/lib/functions";
import { displayPrismaErrorCode } from "@/lib/prisma-errors";
import { ValidationConflict } from "@/app/server/data/validation-data";
import { validateData } from "@/app/server/validate";
import Button from "@/ui/button";
import ValidationConflictsDialog from "@/ui/validation-conflicts-dialog";

export interface CountryEntity {
  id?: number;
  name?: string;
  dialCode?: string;
}

export interface AddressEntity {
  id?: number;
  street?: string;
  number?: string;
  box?: string;
  city?: string;
  postalcode?: string;
  county?: string;
  country: CountryEntity;
}

export interface UserEntity {
  id?: number;
  username?: string;
  lastname: string;
  firstname: string;
  avatar?: string;
  phone?: string;
  email: string;
  password: string;
  passwordless?: boolean;
  blocked?: boolean;
  managed?: boolean;
  address: AddressEntity;
}

export const defaultUserEntity: UserEntity = {
  lastname: "",
  firstname: "",
  username: "",
  email: "",
  password: "",
  managed: false,
  blocked: false,
  passwordless: false,
  address: {
    country: {},
  },
};

export interface UserCarrouselProps {
  entity: UserEntity;
  policies: tPolicy[];
  linkedpolicies: number[];
  roles: tRole[];
  linkedroles: number[];
  groups: tGroup[];
  linkedgroups: number[];
  countries: tCountry[];
}

enum Pages {
  DETAILS = "details",
  POLICIES = "policies",
  ROLES = "roles",
  GROUPS = "groups",
}

const UserCarrousel = (props: UserCarrouselProps) => {
  const { push } = useRouter();
  const { user, setUser } = useUser();
  const { getToastDuration } = useToastSettings();

  const currentPage = useRef<string>(Pages.DETAILS);
  const showCurrentPage = (_page: string): void => {
    const element: HTMLElement | null = document.getElementById(_page);
    if (element) {
      element.scrollIntoView({ behavior: "instant" });
    }
  };

  const formMethods = useForm({
    defaultValues: props.entity,
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = formMethods;

  const [tableDataPolicies, setTableDataPolicies] = useState<Data[]>([]);
  const [tableDataRoles, setTableDataRoles] = useState<Data[]>([]);
  const [tableDataGroups, setTableDataGroups] = useState<Data[]>([]);

  const processTableData = (
    _policies: tPolicy[],
    _roles: tRole[],
    _groups: tGroup[]
  ): void => {
    setTableDataPolicies(mapPolicies(_policies));
    setTableDataRoles(mapRoles(_roles));
    setTableDataGroups(mapGroups(_groups));
  };

  const linkedPolicies = useRef<number[]>([]);
  const linkedRoles = useRef<number[]>([]);
  const linkedGroups = useRef<number[]>([]);

  const [reload, setReload] = useState<number>(0);

  const [valid, setValid] = useState<boolean>(false);

  const ignoreEscape = (): void => {
    addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  };

  useEffect(() => {
    ignoreEscape();

    linkedPolicies.current = props.linkedpolicies;
    linkedRoles.current = props.linkedroles;
    linkedGroups.current = props.linkedgroups;

    setValid(
      props.linkedpolicies.length +
        props.linkedroles.length +
        props.linkedgroups.length <
        2
    );

    setReload((x: number) => x + 1);

    processTableData(props.policies, props.roles, props.groups);

    reset(props.entity);

    const countryname: string =
      props.entity.address.country.name ?? DEFAULT_COUNTRY;

    const countryEntity: tCountry | undefined = props.countries.find(
      (_country: tCountry) => _country.name === countryname
    );

    if (countryEntity) {
      setValue("address.country.id", countryEntity.id);
      setValue("address.country.name", countryEntity.name);
      setValue("address.country.dialCode", countryEntity.dialCode!);
      setCountry(countryname);
    }

    setPasswordRequired(!(props.entity.passwordless ?? false));

    currentPage.current = Pages.DETAILS;
    showCurrentPage(Pages.DETAILS);
  }, [props]);

  const UserFormControl = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_7%_2%_1%_7%_2%] py-1.5">
        <div className="col-start-2">
          <label className="text-sm">Blocked:</label>
        </div>
        <div className="col-start-3 -mt-0.5">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded-sm"
            {...register("blocked")}
          />
        </div>
        <div className="col-start-5">
          <label className="text-sm">Managed:</label>
        </div>
        <div className="col-start-6 -mt-0.5">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded-sm"
            {...register("managed")}
          />
        </div>
      </div>
    );
  };

  const handleSelectAvatar = (_filename: string): void => {
    setValue("avatar", _filename);
  };

  const FormUsernameAvatar = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_48%_2%_48%_2%]">
        <div className="col-start-2">
          <input
            type="text"
            placeholder="username..."
            className="input input-sm w-11/12"
            {...register("username")}
          />
        </div>
        <div className="col-start-4 -mt-1">
          <AvatarSelect
            _avatar={getValues("avatar") ?? "john.doe.png"}
            forwardFileName={handleSelectAvatar}
          />
        </div>
      </div>
    );
  };

  const FormLastnameFirstname = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_48%_2%_48%_2%]">
        <div className="col-start-2">
          <input
            type="text"
            placeholder="last name..."
            className="input input-sm w-11/12 validator"
            required
            minLength={1}
            maxLength={50}
            {...register("lastname")}
          />
        </div>
        <div className="col-start-4">
          <input
            type="text"
            placeholder="first name..."
            className="input input-sm w-11/12 validator"
            required
            minLength={1}
            maxLength={50}
            {...register("firstname")}
          />
        </div>
      </div>
    );
  };

  const FormPhone = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_10%_1%_33%]">
        <div className="col-start-2">
          <input
            type="text"
            placeholder="dial"
            className="input input-sm w-11/12"
            disabled
            defaultValue={"(+9876)"}
            {...register("address.country.dialCode")}
            // {...register("address.country.name")}
          />
        </div>
        <div className="col-start-4">
          <input
            type="text"
            placeholder="phone..."
            className="input input-sm w-12/12"
            {...register("phone")}
          />
        </div>
      </div>
    );
  };

  const StreetNrBox = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_48%_2%_10%_1%_10%_2%]">
        <div className="col-start-2">
          <input
            type="text"
            placeholder="street..."
            className="input input-sm w-11/12"
            {...register("address.street")}
          />
        </div>
        <div className="col-start-4">
          <input
            type="text"
            placeholder="nr..."
            className="input input-sm w-11/12"
            {...register("address.number")}
          />
        </div>
        <div className="col-start-6">
          <input
            type="text"
            placeholder="box..."
            className="input input-sm w-11/12"
            {...register("address.box")}
          />
        </div>
      </div>
    );
  };

  const CityPostalcode = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_48%_2%_22%]">
        <div className="col-start-2">
          <input
            type="text"
            placeholder="city..."
            className="input input-sm w-11/12"
            {...register("address.city")}
          />
        </div>
        <div className="col-start-4">
          <input
            type="text"
            placeholder="postal code..."
            className="input input-sm w-11/12"
            {...register("address.postalcode")}
          />
        </div>
      </div>
    );
  };

  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);

  const handleSelectCountry = (_country: tCountry): void => {
    setValue("address.country.id", _country.id);
    setValue("address.country.name", _country.name);
    setValue("address.country.dialCode", _country.dialCode ?? undefined);
    setCountry(_country.name);
  };

  const CountyCountry = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_48%_2%_22%]">
        <div className="col-start-2">
          <input
            type="text"
            placeholder="county..."
            className="input input-sm w-11/12"
            {...register("address.county")}
          />
        </div>
        <div className="col-start-4">
          <CountrySelect
            countries={props.countries}
            selected={country}
            handleSetCountry={handleSelectCountry}
            className="w-11/12"
          />
        </div>
      </div>
    );
  };

  const UserFormIdentification = (): JSX.Element => {
    return (
      <div>
        <div className="mt-1">
          <FormUsernameAvatar />
        </div>
        <div className="mt-1">
          <FormLastnameFirstname />
        </div>
        <div className="mt-1">
          <FormPhone />
        </div>
        <div className="mt-1">
          <StreetNrBox />
        </div>
        <div className="mt-1">
          <CityPostalcode />
        </div>
        <div className="mt-1">
          <CountyCountry />
        </div>
      </div>
    );
  };

  const [passwordRequired, setPasswordRequired] = useState<boolean>(false);

  const handlePasswordlessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const checked: boolean = event.target.checked;

    setPasswordRequired(!checked);

    setValue("passwordless", checked);
  };

  const UserFormAccess = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_48%_2%_22%_1%_2%_1%_22%] mt-2">
        <div className="col-start-2">
          <label className="input validator">
            <CiAt size={16} />
            <input
              type="email"
              autoComplete="on"
              placeholder="email..."
              className="input-sm w-11/12"
              required
              {...register("email")}
            />
          </label>
          <div className="validator-hint">Enter valid email address</div>
        </div>
        <div className="col-start-4">
          <label className="input validator">
            <PiPassword size={16} />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="password..."
              className="input-sm w-11/12"
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              required={passwordRequired}
              disabled={!passwordRequired}
              {...register("password")}
            />
          </label>
          <p className="validator-hint">
            Must be more than 8 characters, including
            <br />
            At least one number
            <br />
            At least one lowercase letter
            <br />
            At least one uppercase letter
          </p>
        </div>
        <div className="col-start-6 mt-1">
          <input
            id="passwordless"
            type="checkbox"
            // checked={!passwordRequired}
            className="checkbox checkbox-xs rounded-sm"
            {...register("passwordless")}
            onChange={(e) => handlePasswordlessChange(e)}
          />
        </div>
        <div className="col-start-8 mt-1">
          <label>Passwordless</label>
        </div>
      </div>
    );
  };

  const UserForm = (): JSX.Element => {
    return (
      <div className="grid w-[100%] grid-rows-[10%_55%_35%] space-y-1">
        <UserFormControl />
        <UserFormIdentification />
        <UserFormAccess />
      </div>
    );
  };

  const handleChangeRoleSelection = (_ids: number[]) => {
    const equal: boolean =
      _ids.length === linkedRoles.current.length &&
      linkedRoles.current.every(function (value, index) {
        return value === _ids[index];
      });

    if (!equal) {
      linkedRoles.current = _ids;
      handleButtons(linkedPolicies.current, _ids, linkedGroups.current);
    }

    showCurrentPage(currentPage.current);
  };

  const Roles = (): JSX.Element => {
    return (
      <div>
        <DataTable
          data={tableDataRoles}
          columns={columnsRoles}
          selectedItems={linkedRoles.current}
          Toolbar={DataTableToolbar}
          handleChangeSelection={handleChangeRoleSelection}
        />
      </div>
    );
  };

  const handleButtons = (
    _policies: number[],
    _roles: number[],
    _groups: number[]
  ): void => {
    const sum: number = _policies.length + _roles.length + _groups.length;

    setValid(sum < 2);
  };

  const handleChangePolicySelection = (_ids: number[]) => {
    const equal: boolean =
      _ids.length === linkedPolicies.current.length &&
      linkedPolicies.current.every(function (value, index) {
        return value === _ids[index];
      });

    if (!equal) {
      linkedPolicies.current = _ids;

      handleButtons(_ids, linkedRoles.current, linkedGroups.current);
    }

    showCurrentPage(currentPage.current);
  };

  const Policies = (): JSX.Element => {
    return (
      <div>
        <DataTable
          data={tableDataPolicies}
          columns={columnsPolicies}
          selectedItems={linkedPolicies.current}
          Toolbar={DataTableToolbar}
          handleChangeSelection={handleChangePolicySelection}
        />
      </div>
    );
  };

  const handleChangeGroupSelection = (_ids: number[]) => {
    const equal: boolean =
      _ids.length === linkedGroups.current.length &&
      linkedGroups.current.every(function (value, index) {
        return value === _ids[index];
      });

    if (!equal) {
      linkedGroups.current = _ids;

      handleButtons(linkedPolicies.current, linkedRoles.current, _ids);
    }

    showCurrentPage(currentPage.current);
  };

  const Groups = (): JSX.Element => {
    return (
      <div>
        <DataTable
          data={tableDataGroups}
          columns={columnsGroups}
          selectedItems={linkedGroups.current}
          Toolbar={DataTableToolbar}
          handleChangeSelection={handleChangeGroupSelection}
        />
      </div>
    );
  };

  const handleDetailsPage = (): void => {
    currentPage.current = Pages.DETAILS;
    location.href = "#details";
  };

  const handlePoliciesPage = (): void => {
    currentPage.current = Pages.POLICIES;
    location.href = "#policies";
  };

  const handleRolesPage = (): void => {
    currentPage.current = Pages.ROLES;
    location.href = "#roles";
  };

  const handleGroupsPage = (): void => {
    currentPage.current = Pages.GROUPS;
    location.href = "#groups";
  };

  const Carrousel = (): JSX.Element => {
    return (
      <>
        <div id="carrousel" className="relative h-[95%] carousel w-full">
          <div id="details" className="carousel-item w-full">
            <UserForm />
          </div>
          <div id="policies" className="carousel-item w-full">
            <Policies />
          </div>
          <div id="roles" className="carousel-item w-full">
            <Roles />
          </div>
          <div id="groups" className="carousel-item w-full">
            <Groups />
          </div>
        </div>
        <div className="flex w-full justify-center gap-2 py-2">
          <button
            type="button"
            onClick={handleDetailsPage}
            className="flex items-center space-x-2"
          >
            <BiSolidUserDetail size={16} />
            <label className="cursor-pointer text-xs">Details</label>
          </button>

          <button
            type="button"
            onClick={handlePoliciesPage}
            className="flex items-center space-x-2"
          >
            <MdPolicy size={16} />
            <label className="cursor-pointer text-xs">Policies</label>
          </button>

          <button
            type="button"
            onClick={handleRolesPage}
            className="flex items-center space-x-2"
          >
            <GiScrollUnfurled size={16} />
            <label className="cursor-pointer text-xs">Roles</label>
          </button>

          <button
            type="button"
            onClick={handleGroupsPage}
            className="flex items-center space-x-2"
          >
            <FaPeopleGroup size={16} />
            <label className="cursor-pointer text-xs">Groups</label>
          </button>
        </div>
      </>
    );
  };

  const provisionUserForCreate = (_entity: UserEntity): tUserCreate => {
    const result: tUserCreate = {
      username: _entity.username,

      firstname: _entity.firstname,
      lastname: _entity.lastname,
      email: _entity.email,
      password: _entity.password,

      avatar: _entity.avatar,
      blocked: _entity.blocked,
      managed: _entity.managed,
      passwordless: _entity.passwordless,
      phone: _entity.phone,

      loggedinDate: new Date(),

      address: {
        create: {
          street: _entity.address.street,
          number: _entity.address.number,
          box: _entity.address.box,
          city: _entity.address.city,
          postalcode: _entity.address.postalcode,
          county: _entity.address.county,
          country: {
            connect: {
              id: _entity.address.country.id,
            },
          },
        },
      },

      policies: {
        connect: linkedPolicies.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      roles: {
        connect: linkedRoles.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      groups: {
        connect: linkedGroups.current.map((_id: number) => {
          return { id: _id };
        }),
      },
    };

    return result;
  };

  const handleCreateUser = async (_entity: UserEntity): Promise<void> => {
    const user: tUserCreate = provisionUserForCreate(_entity);

    await createUser(user).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `User create error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `User '${user.firstname} ${user.lastname}' created`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/users/id`));
      }
      handleCancelClick();
    });
  };

  const provisionUserForUpdate = (_entity: UserEntity): tUserUpdate => {
    const result: tUserUpdate = {
      id: _entity.id,
      username: _entity.username,
      lastname: _entity.lastname,
      firstname: _entity.firstname,
      avatar: _entity.avatar,
      phone: _entity.phone,
      email: _entity.email,
      password: _entity.password,
      passwordless: _entity.passwordless,
      blocked: _entity.blocked,
      managed: _entity.managed,
      attemps: 0,
      address: {
        update: {
          where: {
            id: _entity.address.id,
          },
          data: {
            street: _entity.address.street,
            number: _entity.address.number,
            box: _entity.address.box,
            city: _entity.address.city,
            postalcode: _entity.address.postalcode,
            county: _entity.address.county,
            country: {
              connect: {
                id: _entity.address.country.id,
              },
            },
          },
        },
      },
      policies: {
        set: linkedPolicies.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      roles: {
        set: linkedRoles.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      groups: {
        set: linkedGroups.current.map((_id: number) => {
          return { id: _id };
        }),
      },
    };

    return result;
  };

  const handleUpdateUser = async (_entity: UserEntity): Promise<void> => {
    const _user: tUserUpdate = provisionUserForUpdate(_entity);

    await updateUser(_user).then(async (errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `User update error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `User '${_user.firstname} ${_user.lastname}' updated`,
          getToastDuration()
        );
        if (_user.id === user?.id) {
          const __user: tUser | null = await loadUserById(_user.id as number);
          setUser(__user);
        }

        push(absoluteUrl(`/iam/users/id`));
      }
      handleCancelClick();
    });
  };

  const onSubmit: SubmitHandler<UserEntity> = (formData: UserEntity) => {
    if (formData.id) {
      handleUpdateUser(formData);
    } else {
      handleCreateUser(formData);
    }
  };

  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "userdialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  const [conflicts, setConflicts] = useState<ValidationConflict[]>([]);
  const [validationConflictDialogOpen, setValidationConflictDialogOpen] =
    useState<boolean>(false);

  const validateDependencies = async (): Promise<void> => {
    const _entity: UserEntity = getValues();

    const _selectedPolicies: tPolicy[] = props.policies.filter(
      (_policy: tPolicy) => linkedPolicies.current.includes(_policy.id)
    );

    const _mappedPolicies: Data[] = mapPolicies(_selectedPolicies);

    const _selectedRoles: tRole[] = props.roles.filter((_role: tRole) =>
      linkedRoles.current.includes(_role.id)
    );
    const _mappedRoles: Data[] = mapRoles(_selectedRoles);

    const _selectedGroups: tGroup[] = props.groups.filter((_group: tGroup) =>
      linkedGroups.current.includes(_group.id)
    );
    const _mappedGroups: Data[] = mapGroups(_selectedGroups);

    let data: Data = {
      id: -1,
      description: "",
      name: _entity.lastname,
      children: [..._mappedPolicies, ..._mappedRoles, ..._mappedGroups],
      extra: {
        subject: "User",
      },
    };
    await validateData(data).then((conflicts: ValidationConflict[]) => {
      if (conflicts.length > 0) {
        setConflicts(conflicts);
        setValidationConflictDialogOpen(true);
      }

      setValid(!(conflicts.length > 0));
    });
  };

  const Buttons = (): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Button
          id="cancelbutton"
          name="Cancel"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          onClick={handleCancelClick}
          className="bg-cancel"
          type="button"
        />
        {!props.entity.id && (
          <Button
            id="createbutton"
            name="Create"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            type="submit"
            disabled={!valid}
          />
        )}
        {props.entity.id && (
          <Button
            id="updatebutton"
            name="Update"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            type="submit"
            disabled={!valid}
          />
        )}
        <Button
          id="validatebutton"
          name="Validate"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          className="bg-custom"
          type="button"
          disabled={valid}
          onClick={validateDependencies}
        />
      </div>
    );
  };

  const renderComponent = () => {
    return (
      <>
        <div className="hidden">{reload}</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative w-[100%] h-[450px] grid grid-cols-[90%_10%]"
        >
          <div>
            <Carrousel />
          </div>
          <div className="flex justify-end">
            <Buttons />
          </div>
        </form>
        <ValidationConflictsDialog
          open={validationConflictDialogOpen}
          conflicts={conflicts}
        >
          <Button
            name="Close"
            onClick={() => setValidationConflictDialogOpen(false)}
            className="bg-custom"
            size="small"
          />
        </ValidationConflictsDialog>
      </>
    );
  };

  return <>{renderComponent()}</>;
};

export default UserCarrousel;
