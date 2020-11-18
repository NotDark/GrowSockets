import { EventEmitter } from "events";
import Wrapper from "./Wrapper";
import Http from "./Http";
import DefaultCache from "./Cache/Default";

// types
import { Config } from "./Types/Config";
import { Cache } from "./Types/Cache";

class Server extends EventEmitter {
  private port: number;
  public cache: Cache;

  constructor(config?: Config) {
    super();

    if (config)
      config = {
        port: 17091,
        http: {},
        cache: new DefaultCache(),
      };

    if (config.http.enabled) {
      this.log("HTTP Server Started.");
      Http(
        config.http.serverPort || 17091,
        config.http.serverIP || "127.0.0.1"
      );
    }

    this.cache = config.cache;
    this.port = config.port;
  }

  /**
   * Listens for the `connect` event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(event: "connect", listener: (netID: number) => void): this;

  /**
   * Listens for the `data` event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(
    event: "data",
    listener: (netID: number, data: Buffer) => void
  ): this;

  /**
   * Listens for the `disconnect` event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(event: "disconnect", listener: (netID: number) => void): this;

  /**
   * Listens for the specified event event.
   * @param event The type of the event.
   * @param listener The callback to execute if the event is emitted.
   */
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  /**
   * Logs something to the console asynchronously and with a format
   * @param args Same arguments to pass when using `console.log`
   */
  public async log(...args: any[]): Promise<void> {
    return new Promise((resolve) => {
      const date = new Date();

      resolve(
        console.log(
          `[${date.toDateString()} ${date.toLocaleTimeString()}] |`,
          ...args
        )
      );
    });
  }

  /**
   * Starts listening to the port to start the ENet Server.
   */
  public listen() {
    const port = this.port || 17091;

    Wrapper.init(port);
    this.log("ENet Server now initiated on port.", port);

    Wrapper.emitter(this.emit.bind(this));
    this.log("Event Emitter function has now been set.");

    Wrapper.accept();
    this.log("Now acknowledging events.");
  }
}

export default Server;
