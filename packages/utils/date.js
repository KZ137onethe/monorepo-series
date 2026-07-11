// 自定义时间方法
class UseDate {
	static StartYear = 1970
	timestamp = 0; // 时间戳
	constructor(...args) {
		const d = args.length !== 0 ? new Date(...args) : new Date;
		this.timestamp = d.valueOf();
	}

	// 返回对象原始值的方法
	[Symbol.toPrimitive](hint) {
		if(hint === 'number') {
			return this.timestamp
		} else if (hint === 'string') {
			return UseDate.format(this.timestamp, 'all')
		}
	}

	/**
	 * 格式化函数
	 * @param {Date | number} s
	 * @param {'time' | 'date' | 'all'} type
	 */
	static format(s, type = "all") {
		let date = s;
		let options = {}
		if(type === 'time') {
			options = {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			}
		} else if(type === "date") {
			options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}
		} else if (type === "all") {
			options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			};
		}

		if(!(s instanceof Date)) {
			date = new Date(s)
		}

		const content = new Intl.DateTimeFormat("zh-CN", options).format(s)
		return content;
	}

	/**
	 * 时间比较
	 * @param {Number} timestamp 时间差
	 * @param {boolean} greater 是否大于？
	 */
	static compare(timestamp, greater = true) {
		let yes = true
		if((timestamp < 0 && greater) || (timestamp > 0 && !greater)) yes = false;
		const date = new Date(Math.abs(timestamp))
		const res = {
			year: date.getFullYear() - UseDate.StartYear,
			month: date.getMonth(),
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds(),
		}

		return {
			val: yes,
			// 返回对象原始值的方法
			[Symbol.toPrimitive](hint) {
				return this.val;
			},
			real: res
		};
	}
}

export {
	UseDate
}
