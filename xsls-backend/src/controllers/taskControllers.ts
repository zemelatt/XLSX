import taskModel from "../models/taskModel";
import Express from "express";
import { UploadedFile } from "express-fileupload";
import joi from "joi";
import { where } from "sequelize";
import xlsx from "xlsx";

const headers = [
  "Item No ",
  "Description",
  "Unit ",
  "Qty ",
  "Rate ",
  "Amount ",
];

export async function uploadTaskSheet(
  req: Express.Request,
  res: Express.Response
) {
  try {
    console.log(req.files);
    if (!req.files || req.files.taskSheet === undefined) {
      throw new Error("File not uploaded");
    }

    const taskSheet: UploadedFile | UploadedFile[] | undefined =
      req.files.taskSheet;

    // assumption  here only one file is being uploaded
    // in a production level code this should probably be a background process

    if (!Array.isArray(taskSheet)) {
      const excelFile = xlsx.read(taskSheet.data, { type: "buffer" });

      for (const excelSheetsNames of excelFile.SheetNames) {
        const excelSheet = excelFile.Sheets[excelSheetsNames];

        const excelRows = xlsx.utils.sheet_to_json(excelSheet, {
          header: headers,
        });

        let currentItemNo = "1"; // default start

        for (const excelRow of excelRows) {
          let row: any = excelRow;

          if (row[headers[0]] !== undefined) {
            currentItemNo = row[headers[0]];
          }
          const task = {
            ItemNo:
              row[headers[0]] === undefined ? currentItemNo : row[headers[0]],
            Description: row[headers[1]] || "",
            Unit: row[headers[2]] || "",
            Qty: row[headers[3]] || "",
            Rate: row[headers[4]] || "",
            Amount: row[headers[5]] || "",
          };
          const existingTask = await taskModel.findOne({ where: task });
          if (existingTask) {
            const id = existingTask.getDataValue("id");
            taskModel.update(task, { where: { id: id } });
          } else {
            taskModel.create(task);
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getAllTasks(req: Express.Request, res: Express.Response) {
  try {
    const tasks = await taskModel.findAll();
    res.send(tasks);
  } catch (error: unknown) {
    res.send(500);
  }
}

// get Single task
export async function getTask(req: Express.Request, res: Express.Response) {
  try {
    const validateSchema = () =>
      joi
        .object({
          id: joi.string().required(),
        })
        .unknown(true)
        .required();
    const { id } = validateSchema().validate(req.params).value;
    const task = await taskModel.findOne({ where: { id: id } });
    res.send(task);
  } catch (error) {
    res.send(404);
  }
}

// delete single task by id
export async function deleteTask(req: Express.Request, res: Express.Response) {
  try {
    const validateSchema = () =>
      joi
        .object({
          id: joi.string().required(),
        })
        .unknown(true)
        .required();
    const { id } = validateSchema().validate(req.params).value;
    await taskModel.destroy({ where: { id: id } });
    res.send(200);
  } catch (error) {
    res.send(404);
  }
}

export async function updateTask(req: Express.Request, res: Express.Response) {
  try {
    // console.log(req.body);
    const validateSchema = () =>
      joi
        .object({
          id: joi.number().required(),
          ItemNo: joi.string().required(),
          Description: joi.string().optional(),
          Unit: joi.string().optional(),
          Qty: joi.number().optional(),
          Rate: joi.string().optional(),
          Amount: joi.string().optional(),
        })
        .unknown(true)
        .required();
    const { error, value } = validateSchema().validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    // console.log(error);
    const { id, ItemNo, Description, Unit, Qty, Rate, Amount } = value;
    const [updatedRowCount] = await taskModel.update(
      {
        ItemNo,
        Description,
        Unit,
        Qty,
        Rate,
        Amount,
      },
      { where: { id: id } }
    );
    if (updatedRowCount === 0) {
      throw new Error("Task Not Found");
    }
    const updatedTask = await taskModel.findOne({ where: { id: id } });
    res.send(updatedTask);
  } catch (error: any) {
    res.status(404).send({ error: error?.message });
  }
}
