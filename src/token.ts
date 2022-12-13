import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/Token/Token"
import {
 User,
 Lady,
 PreviousOwner
} from "../generated/schema"
import { ipfs, json, JSONValue } from "@graphprotocol/graph-ts";

const ipfsHash = "QmTngWTnURuyiz1gtoY33FKghCiU2uQusXpnUc36QJNKsY";

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let previousOwner = PreviousOwner.load(event.params.previousOwner.toHexString()); 
  if (!previousOwner) {
      previousOwner = new PreviousOwner(event.params.previousOwner.toHexString())
      previousOwner.lastOwner = event.params.previousOwner.toHexString();
  }
  previousOwner.save()
}

export function handleTransfer(event: TransferEvent): void {
  let lady = Lady.load(event.params.tokenId.toString());

  if (!lady) {
    lady = new Lady(event.params.tokenId.toHexString());
    lady.tokenID = event.params.tokenId;
    lady.tokenURI = "/" + event.params.tokenId.toString();
    let metadata = ipfs.cat(ipfsHash+lady.tokenURI);

    if (metadata) {
      const value = json.fromBytes(metadata).toObject();
      if (value) {
        const name = value.get("name");
        const description = value.get("description");
        if (name) {
          lady.name = name.toString();
        }
        if (description) {
          lady.description = description.toString();
        }
      }
      let attributes: JSONValue[];
      let ladyAttr = value.get("attributes");
      if (ladyAttr) {
        attributes = ladyAttr.toArray();

        for (let i=0; i< attributes.length; i++) {
          let item = attributes[i].toObject();
          let trait: String;
          let traitName = item.get("trait_name")
          if (traitName) {
            trait = traitName.toString();
            let value: string;
            let traitValue = item.get("value");
            if (traitValue) {
              value = traitValue.toString();
              if (trait ==  "hair") {
                lady.hairStyle == value
              }
              if (trait == "Skin") {
                lady.skinColor = value;
              }
              if (trait == "Eyes") {
                lady.eyeColor = value;
              }
              if (trait == "Face Expression") {
                lady.faceExpression = value;
              }
            }
          }
        }
      }
    }
  }

  lady.owner = event.params.to.toHexString();
  lady.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString())
  }
  user.save()
}
