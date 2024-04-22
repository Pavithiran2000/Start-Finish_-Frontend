function paginate<T>(array: T[], pageSize: number): T[][] {
    const pageCount: number = Math.ceil(array.length / pageSize);
    return Array.from({ length: pageCount }, (_, index) =>
      array.slice(index * pageSize, (index + 1) * pageSize)
    );
}

export {};
